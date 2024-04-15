import { pipe, fromEvent, fromPromise, flatten, map, tap } from "callbag-common"
import pairwise from "callbag-pairwise"
import { state } from "callbag-state"
import { storeData, hasher } from "./utilities"
import { getMessages } from "./messages"
import { Hash } from "./types"

const logUserInput = (function () { const context = "[userInput pipeline]"; const color="bisque"; return Function.prototype.bind.call(console.log, console, `%c${context}`, `font-weight:bold;color:${color};`)})() // prettier-ignore
const logOpLog = (function () { const context = "[opLog pipeline]"; const color="aqua"; return Function.prototype.bind.call(console.log, console, `%c${context}`, `font-weight:bold;color:${color};`)})() // prettier-ignore
const logEveLog = (function () { const context = "[evolution pipeline]"; const color="bluevelvet"; return Function.prototype.bind.call(console.log, console, `%c${context}`, `font-weight:bold;color:${color};`)})() // prettier-ignore
const logStore = (function () { const context = "[oplog.ts] [store]"; const color="hotpink"; return Function.prototype.bind.call(console.log, console, `%c${context}`, `font-weight:bold;color:${color};`)})() // prettier-ignore

enum Signal {
	START = 0,
	DATA = 1,
	END = 2
}
// credit: callbag-observe
const observe = (operation: Function) => (source: Function) => {
	source(Signal.START, (msgType: Signal, msgPayload: any) => {
		if (msgType === Signal.END) operation(msgPayload)
	})
}

const seq = state(0)

const userInput = pipe(
	fromEvent(document, "pointerdown"),
	map((event) => ["pointerdown", event.clientX, event.clientY])
	// tap((input) => storeData.log("uievent", { id: `${input[0]}-X:${input[1]},Y:${input[2]}`, input }, true))
)

const opLog = pipe(
	userInput,
	map((point) => fromPromise(getMessage(point))), // messages are created in messages.ts
	flatten,
	// tap((data) => logOpLog("[opLog]", data)),
	pairwise,
	map((pair: any) => {
		const [previous, current] = pair
		if (!previous || !current) console.error("Previous or current is nullish", "previous:", previous, "current:", current)

		const linked: [Hash, Hash] = [previous.id, current.id]
		storeData.log("oplog", linked, false)

		return linked
	})
)

// todo: callbag-scan to build the evolution log from the oplog
const evolutionLog = pipe(
	opLog,
	tap((pair) => logEveLog("[pair]", pair))
)

observe((message: any) => logUserInput(message, "[userInput] output:", false))(userInput)
observe((message: any) => logOpLog(message, "[opLog] output:", true))(opLog)
observe((message: any) => logEveLog(message, "[evolutionLog] output:", true))(evolutionLog)

/**
	 * thinking out loud
				probably shouldn't do anything here with sequence and hash...?
				linking ought to be done in the evolution log only? certainly, links do not belong ***in*** the messages... 
				otherwise the messages become ossified - we want to be able to shift them around!
				... however the oplog should probably be an immutable hash-linked list?
				or is there more benefit of potentially being able to rearrange even the oplog? for, say, publishing a design once it's "perfect"
	 */

/**
 * 		most likely:
 * 			oplog: should be the true immutable history of what happened - enables full history & timetravel to facilitate trying different things when building the model
 * 			evlog: the dynamic scanned state (materialised view) representing the cad model
 *
 * 			changes to the model (evolution log) are achieved by appending messages to the oplog
 *
 * 			publog: the "committed" version of the oplog - a cleaned up history - there could be many of these & they could be considered like "branches" in git
 */

async function processMessage(sequence: number, message: any) {
	const hash = await hasher(message)
	// try {
	// 	storeData(hash, message)
	// 	storeData.log("debuglog", { message, id: `hashed-message:${hash}` }, true)
	// } catch (error) {
	// 	console.error("Error appending to store.debuglog", error)
	// }
	return [sequence, hash, message]
	// return message
}

let messages: any[] | undefined = undefined

async function getMessage(_mouseInput: any) {
	messages = messages ? messages : await getMessages() // see messages.ts
	const index = seq.get() % messages.length
	const [_sequence, _hash, message] = await processMessage(index, messages[index])
	// todo: do something with mouse input to simulate capturing designer intent
	// const message = [seq.get(), intent, mouseInput]
	seq.set(seq.get() + 1)

	// return [sequence, hash, message]
	return message
}
