import { Option } from "@thames/monads"
import { GeomCommand, Nonce, Hash, CreatePlane, PlaneData, Data, Create } from "./types"
import { canonicalise, calcHash, storeData } from "./utilities"

// const log = (function () { const context = "[api.ts]"; const color="gray"; return Function.prototype.bind.call(console.log, console, `%c${context}`, `font-weight:bold;color:${color};`)})() // prettier-ignore

async function createEntityHash(command: GeomCommand, options: { id: Option<Hash>; nonce: Option<Nonce>; data: Option<Data>; targets: Option<Hash[]>; context: Option<any> }) {
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
			none: async () => await calcHash(canonicalise([command, nonce, data]))
		})) ?? (await calcHash(canonicalise([command, nonce, data])))

	return Promise.resolve([id, nonce])
}

export async function create(
	command: Create<GeomCommand, Data>["command"],
	options: { id: Option<Hash>; nonce: Option<Nonce>; data: Option<Data>; targets: Option<Hash[]>; context: Option<any> }
): Promise<Create<GeomCommand, Data>> {
	const [id, nonce] = await createEntityHash(command, options)

	const data = options.data.unwrapOr({})
	const targets = options.targets.unwrapOr([])
	const context = options.context.unwrapOr({})

	const geometry: Create<GeomCommand, Data> = {
		id,
		command,
		data,
		targets,
		context,
		nonce
	}
	storeData(id, geometry)

	return geometry
}

export async function createPlane(
	command: CreatePlane["command"],
	options: { id: Option<Hash>; nonce: Option<Nonce>; data: Option<PlaneData>; targets: Option<Hash[]>; context: Option<any> }
): Promise<CreatePlane> {
	const [id, nonce] = await createEntityHash(command, options)

	const data = options.data.unwrapOr({})
	const targets = options.targets.unwrapOr([])
	const context = options.context.unwrapOr({})

	const plane = {
		id,
		command,
		data,
		targets,
		context,
		nonce
	}

	storeData(id, plane)
	return plane
}
