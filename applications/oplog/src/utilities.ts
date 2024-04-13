import { Option, None, Some } from "@thames/monads"
import { WorldGeom, PlaneGeom, PlaneParams, PlaneData, CadData, Hash, Nonce, CreatePlane, CreateSketchMessage, GeomCommand, GeomData, GeomParams } from "./types"

export function canonicalise(data: any) {
	// todo properly! sort keys stringify etc ...
	// also, round floats to a small tolerance such as 0.000001mm
	// that way we can canonicalise and hash data to see if we have it already - if we do, the hash will be in the store!
	return [...data]
}

export const calcHash = async (data: any): Promise<Hash> => {
	return await hasher(data)
}

async function createEntity(command: GeomCommand, options: { geomData?: GeomData; geomParams?: GeomParams; nonce?: Nonce } = {}): Promise<Hash> {
	const { geomData, geomParams, nonce } = options
	const data = canonicalise([command, geomData, geomParams, nonce].filter((x) => x !== undefined))
	console.info("[createEntity] [canon]", "data:", data)
	const hash = await calcHash(data)
	storeData(hash, data)
	return hash
}

async function createNewGeomEntityHash(command: GeomCommand, options: { geomData?: GeomData; id?: Option<Hash>; nonce?: Option<Nonce> } = {}) {
	let nonce =
		options?.nonce?.match({
			some: (nonce) => nonce,
			none: () => self.crypto.randomUUID()
		}) ?? self.crypto.randomUUID()

	let id =
		(await options?.id?.match({
			some: (id) => Promise.resolve(id),
			none: async () => await createEntity(command, {...options, nonce})
		})) ?? (await createEntity(command, {...options, nonce}))

	return Promise.resolve([id, nonce])
}

// to update: ensure you pass in the id hash
// to create: a new Plane, don't pass in the id hash - a new one will be generated
export async function createPlaneFn(
	geometry: PlaneGeom,
	options?: { id: Option<Hash>; nonce: Option<Nonce>; targets: Option<Hash[]>; context: Option<any> }
): Promise<CreatePlane> {
	const [idPlane, noncePlane] = await createNewGeomEntityHash("CreatePlane", options)

	const [idPlaneGeom, noncePlaneGeom] = await createNewGeomEntityHash("CreatePlane", options)

	const createPlaneGeom: CreatePlane = {
		id: idPlaneGeom,
		command: "CreatePlane",
		data: {
			plane: geometry
		},
		// targets: options?.targets ?? None,
		targets: Some([idPlane]),
		context: options?.context ?? None,
		nonce: Some(noncePlaneGeom)
	}
	return createPlaneGeom
}

export function storeData(hash: Hash, value: any): void {
	// if (browser) {
	;(globalThis as any).process = (globalThis as any).process ? (globalThis as any).process : {}
	;(globalThis as any).process.store = (globalThis as any).process.store ? (globalThis as any).process.store : {}
	;(globalThis as any).process.store.oplog = (globalThis as any).process.store.oplog ? (globalThis as any).process.store.oplog : []

	// deduplicate: if hash is not in the store then store it!
	if (!(globalThis as any).process.store[hash]) {
		;(globalThis as any).process.store[hash] = value // store hash & value in map for fast retrieval
		;(globalThis as any).process.store.oplog.push([hash, value]) // append hash & value to store oplog
	}

	console.log("[store]", (globalThis as any).process.store)
}

export async function hasher(content: any): Promise<string> {
	// todo: canonicalise content prior to hashing

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
