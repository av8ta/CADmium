import { Option, Some, None } from "@thames/monads"
import { GeomCommand, GeomData, GeomParams, Nonce, Hash, CreatePlane, PlaneData, Data } from "./types"
import { canonicalise, calcHash, storeData } from "./utilities"

// const log = (function () { const context = "[api.ts]"; const color="gray"; return Function.prototype.bind.call(console.log, console, `%c${context}`, `font-weight:bold;color:${color};`)})() // prettier-ignore

async function createEntity(command: GeomCommand, options): Promise<Hash> {
	const { geomData, geomParams, nonce } = options
	const data = canonicalise([command, geomData, geomParams, nonce].filter((x) => x !== undefined))
	const hash = await calcHash(data)
	console.info("[createEntity] [canon]", "hash:", hash, "data:", data)
	// storeData(hash, data)
	return hash
}

async function createNewGeomEntityHash(
	command: GeomCommand,
	options: { id: Option<Hash>; nonce: Option<Nonce>; data: Option<Data>; targets: Option<Hash[]>; context: Option<any> }
) {
	const data = options.data.unwrapOr({})

	// identity is based on id, nonce, and geometric data (geom or params)

	// if a nonce isn't passed in generate random uuid
	let nonce =
		options?.nonce?.match({
			some: (nonce) => nonce,
			none: () => self.crypto.randomUUID()
		}) ?? self.crypto.randomUUID()

	// if an id isn't passed in hash ([command, nonce, data])
	let id =
		(await options?.id?.match({
			some: (id) => Promise.resolve(id),
			none: async () => await calcHash([command, nonce, data])
		})) ?? (await calcHash([command, nonce, data]))

	return Promise.resolve([id, nonce])
}

// to update: ensure you pass in the id hash
// to create: a new Plane, don't pass in the id hash - a new one will be generated
export async function createPlaneFn(
	// geometry?: PlaneGeom,
	options: { id: Option<Hash>; nonce: Option<Nonce>; data: Option<PlaneData>; targets: Option<Hash[]>; context: Option<any> }
): Promise<CreatePlane> {
	const [id, nonce] = await createNewGeomEntityHash("CreatePlane", options)

	const data = options.data.unwrapOr({})
	const targets = options.targets.unwrapOr([])
	const context = options.context.unwrapOr({})

	const plane: CreatePlane = {
		id,
		command: "CreatePlane",
		data,
		targets,
		context,
		nonce
	}
	storeData(id, plane)

	return plane
}

// // to update: ensure you pass in the id hash
// // to create: a new Plane, don't pass in the id hash - a new one will be generated
// export async function createPlaneFn(
// 	// geometry?: PlaneGeom,
// 	options: { id: Option<Hash>; nonce: Option<Nonce>; data: Option<PlaneData>; targets: Option<Hash[]>; context: Option<any> }
// ): Promise<CreatePlane> {
// 	const [id, nonce] = await createNewGeomEntityHash("CreatePlane", options)

// 	const data = options.data.unwrapOr({})
// 	const targets = options.targets.unwrapOr([])
// 	const context = options.context.unwrapOr({})

// 	const plane: CreatePlane = {
// 		id,
// 		command: "CreatePlane",
// 		data,
// 		targets,
// 		context,
// 		nonce
// 	}
// 	storeData(id, plane)

// 	return plane
// }
