// import { Create, Describe } from "./types"

import { None, Some } from "@thames/monads"
import { createPlaneFn } from "./utilities"

const plane = await createPlaneFn(
	{
		origin: [0, 0, 0],
		primary: [1, 0, 0],
		secondary: [0, 1, 0],
		tertiary: [0, 0, 1]
	},
	{ id: None, nonce: Some("abc"), targets: None, context: None }
)

const dup = await createPlaneFn(
	{
		origin: [0, 0, 0],
		primary: [1, 0, 0],
		secondary: [0, 1, 0],
		tertiary: [0, 0, 1]
	},
	{ id: None, nonce: Some("abc"), targets: None, context: None }
)

export const messages = [plane, dup]
