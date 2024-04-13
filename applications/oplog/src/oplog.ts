import { pipe, fromEvent, fromPromise, flatten, startWith, interval, map, filter, subscribe, tap } from "callbag-common"
// import type { Hash, WorldGeom, PlaneGeom, PlaneParams, PlaneData, CadData, Nonce } from "./types"
import { state } from "callbag-state"
import { messages } from "./messages"
import { storeData, hasher } from "./utilities"

const seq = state(0)

const userInput = pipe(
	fromEvent(document, "pointerdown"),
	map((event) => ["pointerdown", event.clientX, event.clientY]),
	map((point) => fromPromise(getMessage(point))), // messages are created in messages.ts
	flatten
)

// prettier-ignore
const opLog = pipe(
	userInput, 
	// do something in here!
	tap(([seq, id, pointerdown]) => console.info("[opLog] [tap]", [seq, id.slice(0,6), pointerdown]))
)

const opLogEvents = pipe(
	opLog,
	// tap(([seq, id, pointerdown]) => console.info([seq, id.slice(0, 6), pointerdown])),
	map(([_seq, id, _pointerdown]) => (globalThis as any).process.store[id]), // use the id to fetch the created entity from the store
	subscribe((message) => console.log("[opLog] [output]", message))
)

async function processMessage(seq: number, message: any) {
	const hash = await hasher(message)
	storeData(hash, [seq, message])
	return hash
}

async function getMessage(mouseInput: any) {
	const index = seq.get() % messages.length
	const intent = await processMessage(index, messages[index])
	const message = [seq.get(), intent, mouseInput]
	seq.set(seq.get() + 1)
	return message
}
