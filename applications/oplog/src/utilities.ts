import { Hash } from "./types"

const log = (function () { const context = "[utilities.ts]"; const color="lightblue"; return Function.prototype.bind.call(console.log, console, `%c${context}`, `font-weight:bold;color:${color};`)})() // prettier-ignore

export function canonicalise(data: any) {
	// todo properly! sort keys stringify etc ...
	// also, round floats to a small tolerance such as 0.000001mm
	// that way we can canonicalise and hash data to see if we have it already - if we do, the hash will be in the store!
	return [...data]
}

export const calcHash = async (data: any): Promise<Hash> => {
	return await hasher(data)
}

function ensureStore(logName: string | undefined = undefined) {
	;(globalThis as any).process = (globalThis as any).process ? (globalThis as any).process : {}
	;(globalThis as any).process.store = (globalThis as any).process.store ? (globalThis as any).process.store : {}
	if (logName) {
		;(globalThis as any).process.store[logName] = (globalThis as any).process.store[logName] ? (globalThis as any).process.store[logName] : []
		;(globalThis as any).process.store[`${logName}-kv`] = (globalThis as any).process.store[`${logName}-kv`] ? (globalThis as any).process.store[`${logName}-kv`] : {}
	}
}

export function storeData(hash: Hash, value: any): void {
	ensureStore()
	;(globalThis as any).process.store[hash] = value // store hash & value in map kv store for fast retrieval

	// deduplicate: if hash is not in the store then store it!
	// if (!(globalThis as any).process.store[hash]) {
	// 	;(globalThis as any).process.store[hash] = value // store hash & value in map kv store for fast retrieval
	// }
}

storeData.log = (logName: string, data: any, duplicate = false) => {
	ensureStore(logName)

	if (data.id) {
		// deduplicate: if hash has not been appended to this log append it!
		if (duplicate || !(globalThis as any).process.store[`${logName}-map`][data.id]) {
			log(`[store.${logName}] append:`, data.id.slice(0, 6), data)
			;(globalThis as any).process.store[logName].push([data.id, data]) // append hash & value to store named `logName`
			;(globalThis as any).process.store[`${logName}-map`][data.id] = data // store key:hash & value:data in map for fast retrieval
		}
	} else if (Array.isArray(data) && data.length === 2) {
		// [Hash, Hash] - a pair right side points to left  [Hash <- Hash]
		// makes a hashlinked list

		;(globalThis as any).process.store[logName].push(data) // append [Hash, Hash] to store named `logName`
	} else console.error("Error: data does not have id:", data)
}

export async function hasher(content: any): Promise<string> {
	// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#examples
	const textEncoder = new TextEncoder()
	const bytes = textEncoder.encode(JSON.stringify(content))
	const digest = await crypto.subtle.digest("SHA-256", bytes)
	const hex = hexify(digest)
	return hex
}

function hexify(buffer: ArrayBuffer) {
	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("")
}
