import { None, Some } from "@thames/monads"
import { expect, test } from "vitest"
import { create, createPlane } from "../api"
import { Create, GeomCommand, Data } from "../types"

const messagelog: Create<GeomCommand, Data>[] = []

test("createPlane entity message", async () => {
	const planeEntity = await createPlane("CreatePlane", { id: None, nonce: Some("abc"), data: None, targets: None, context: None })
  messagelog.push(planeEntity)

	const expected = {
		id: "37b8568e70159df9d99ff8cfd857e1993d5e74c0160248a14027b1b18aec8e33",
		command: "CreatePlane",
		data: {},
		targets: [],
		context: {},
		nonce: "abc"
	}


	expect(planeEntity).toEqual(expected)
})

test("createPlane geometry message", async () => {
	const planeGeom = {
		origin: [0, 0, 0],
		primary: [1, 0, 0],
		secondary: [0, 1, 0],
		tertiary: [0, 0, 1]
	}

	const planeWithGeom = await createPlane("CreatePlane", { id: None, nonce: Some("abc"), data: Some(planeGeom), targets: None, context: None })
  messagelog.push(planeWithGeom)

	const expected = {
		id: "b41e7899f8129558661b1fc373ff427d5aead3d408dde4dcbbfabf9d6dd0c09b",
		command: "CreatePlane",
		data: {
			origin: [0, 0, 0],
			primary: [1, 0, 0],
			secondary: [0, 1, 0],
			tertiary: [0, 0, 1]
		},
		targets: [],
		context: {},
		nonce: "abc"
	}

	expect(planeWithGeom).toEqual(expected)
})

test("createPlane params message", async () => {
	const planeParams = {
		width: 80.9,
		height: 50
	}

	const planeWithParams = await createPlane("CreatePlane", { id: None, nonce: Some("abc"), data: Some(planeParams), targets: None, context: None })
  messagelog.push(planeWithParams)

	const expected = {
    id: '30f463742e366f77080b1e20f224319875f1f81aa6751a70c0cb133e8e75d0b8',
    command: 'CreatePlane',
    data: { width: 80.9, height: 50 },
    targets: [],
    context: {},
    nonce: 'abc'
  }

  console.log(messagelog)

	expect(planeWithParams).toEqual(expected)
})

test("create plane using generic function", async () => {
	const planeEntity = await create("CreatePlane", { id: None, nonce: Some("abc"), data: None, targets: None, context: None })
  
  const expected = messagelog[0]

	expect(planeEntity).toEqual(expected)
})


test("create plane geometry using generic function", async () => {
	const planeGeom = {
		origin: [0, 0, 0],
		primary: [1, 0, 0],
		secondary: [0, 1, 0],
		tertiary: [0, 0, 1]
	}

	const planeWithGeom = await create("CreatePlane", { id: None, nonce: Some("abc"), data: Some(planeGeom), targets: None, context: None })

	const expected = messagelog[1]

	expect(planeWithGeom).toEqual(expected)
})

test("create plane params using generic function", async () => {
	const planeParams = {
		width: 80.9,
		height: 50
	}

	const planeWithParams = await createPlane("CreatePlane", { id: None, nonce: Some("abc"), data: Some(planeParams), targets: None, context: None })

	const expected = messagelog[2]

	expect(planeWithParams).toEqual(expected)
})

