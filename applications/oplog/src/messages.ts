import { None, Some } from "@thames/monads"
import { createPlaneFn } from "./api"

export async function getMessages() {
	const planeGeom = {
		origin: [0, 0, 0],
		primary: [1, 0, 0],
		secondary: [0, 1, 0],
		tertiary: [0, 0, 1]
	}

	const planeParams = {
		width: 80.9,
		height: 50
	}

	const planeEntity = await createPlaneFn({ id: None, nonce: Some("abc"), data: None, targets: None, context: None })
	const planeWithGeom = await createPlaneFn({ id: None, nonce: Some("abcde"), data: Some(planeGeom), targets: None, context: None })
	const planeWithParams = await createPlaneFn({ id: None, nonce: Some("abcdefg"), data: Some(planeParams), targets: None, context: None })

	console.info("========>", [planeEntity, planeWithGeom, planeWithParams])

	return [planeEntity, planeWithGeom, planeWithParams]
}

const result = [
	{
		id: "37b8568e70159df9d99ff8cfd857e1993d5e74c0160248a14027b1b18aec8e33",
		command: "CreatePlane",
		data: {},
		targets: [],
		context: {},
		nonce: "abc"
	},
	{
		id: "1e5ff8c455766c1427db34d310c188d3d2f96f5f18ac45d196a651734e4b190c",
		command: "CreatePlane",
		data: {
			origin: [0, 0, 0],
			primary: [1, 0, 0],
			secondary: [0, 1, 0],
			tertiary: [0, 0, 1]
		},
		targets: [],
		context: {},
		nonce: "abcde"
	},
	{
		id: "72608b33a63ddc89510d554fb562a897e77103176b2382006f60c8095c36b575",
		command: "CreatePlane",
		data: {
			width: 80.9,
			height: 50
		},
		targets: [],
		context: {},
		nonce: "abcdefg"
	}
]
