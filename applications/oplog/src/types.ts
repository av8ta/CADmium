import { Option, Some, None } from "@thames/monads"

export type Hash = string
export type Nonce = Hash // 32 bits of random bytes is fine when implemented. edit: used a uuid, nice and simple

export type Vector3D = [x: number, y: number, z: number]
export type  Point3D = [x: number, y: number, z: number] // prettier-ignore
export type      Ray = [Point3D, Vector3D] // prettier-ignore

export type GeomCommand = "CreateWorld" | "CreateWorldShift" | "CreatePlane" | "CreateSketch" | "CreateCurve" | "CreateExtrusion"
export type OpCommand = "Create" | "Describe" | "Attach" | "Detach"

export type GeomData = PlaneGeom // | SketchGeom | ... | ... etc
export type GeomParams = PlaneParams

export type Pubkey = string

export type Author = {
	pubKey: Pubkey
	sessions: OpId[]
}

export type OpId = {
	peerId: number
	counter: number
}

export type VersionVector = { [peerId in number]: number }
export type Frontiers = OpId[]

export type Clock = {
	date: number
	vv: VersionVector
	ft: Frontiers
}

export type UserMessage<Author, Intent> = {
	author: Author
	clock: Clock
	peers: Author[]
	prev: Option<Hash>
	intent: Intent
}

export type Create<Command, Data> = {
	id: Hash
	nonce: Option<Nonce>

	command: Command
	data: Data
	targets: Option<Hash[]>
	context: Option<any>
}

export type CreatePlane = Create<
	"CreatePlane",
	{
		plane: {
			origin: Point3D
			primary: Vector3D
			secondary: Vector3D
			tertiary: Vector3D
		}
	}
>

export type CreateSketch = Create<
	"CreateSketch",
	{
		targets: []
	}
>

// what is a circle? at it's simplest form it has only a radius.
// what about the centerpoint? the centrepoint is not part of the circle!; it is merely **where** the circle happens to be!
// export type CreateCircle = Create<"CreateCircle", { x: Option<number>; y: Option<number>; radius: number }>

export type CreateCircle = Create<"CreateCircle", { radius: number }>
export type CreateCircleMessage = UserMessage<Author, CreateCircle>

export type CreatePlaneMessage = UserMessage<Author, CreatePlane>
export type CreateSketchMessage = UserMessage<Author, CreateSketch>

export type Describe<EntityHash> = {
	entity: EntityHash
	description: string
	data: any
}
export type Attach<TargetHash, EntityHash, CadData> = {
	target: TargetHash
	entity: EntityHash
	data: CadData
}
export type Detach<EntityHash> = {
	entity: EntityHash
}

export type CadData = GeomData | GeomParams

// export type CollectionSet<Hash extends string | number | symbol> = Record<Hash, unknown>
// export type CollectionList<Hash> = Array<Hash>

export type OpData = any

export type WorldGeom = Ray
export type WorldGeomShift = Vector3D

export type PlaneGeom = {
	origin: Point3D
	primary: Vector3D
	secondary: Vector3D
	tertiary: Vector3D
}
export type PlaneParams = {
	width: number
	height: number
	normal: Ray // ? normal in center of width and height ? length & direction of vector sets z-index relative to PlaneGeomData
}
export type PlaneData = PlaneGeom & PlaneParams

export type CurveData = Line | Arc | Circle | Nurbs | Rectangle | Polygon | PolyCurve
export type Line = [Point3D, Point3D] | [Point3D, Vector3D] | [Vector3D, Point3D] | [Vector3D, Vector3D] // hmmm. no, incorrect! todo fix. all curve types should have a start and end as the universal interface.

// todo: shush!, compiler
export type Arc = any
export type Nurbs = any
export type Circle = any
export type Polygon = any
export type Rectangle = any
export type PolyCurve = any
export type CurveGeom = any
export type SketchGeom = any
export type ExtrusionGeom = any
export type CurveParams = any
export type WorldParams = any
export type SketchParams = any
export type ExtrusionParams = any
export type WorldShiftParams = any

// ============================================================================================================================

// type Option<T> = None | Some<T>
// type None = {
// 	_tag: "None"
// }
// type Some<T> = {
// 	_tag: "Some"
// 	readonly value: T
// }

// export type CreateEntityHash<GeomCommand, CadData> = (args: Geometry<GeomCommand, CadData>) => Hash
// export type CreateOpHash<OpCommand, CadData> = (args: Operation<OpCommand, CadData>) => Hash

// export type GeomData = WorldGeom | WorldGeomShift | PlaneGeom
// export type GeomData = WorldGeom | WorldGeomShift | PlaneGeom | SketchGeom | CurveGeom | ExtrusionGeom
// export type GeomParams = WorldParams | WorldShiftParams | PlaneParams | SketchParams | CurveParams | ExtrusionParams

// export type Geometry<GeomCommand, GeomData> = {
// 	hash: CreateGeomEntityHash<GeomCommand, GeomData>
// 	data: GeomData
// }

// export type Operation<OpType, OpData> = {
// 	hash: CreateEntityHash<OpType, OpData>
// 	data: OpData
// }
