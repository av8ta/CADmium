import initWasm from "@vlcn.io/crsqlite-wasm"
import wasmUrl from "@vlcn.io/crsqlite-wasm/crsqlite.wasm?url"
import schemaContent from "./schemas.sql?raw"

export async function createDB(name = "cadmium.db") {
  const sqlite = await initWasm(() => wasmUrl)

  const db = await sqlite.open(name)
  await db.automigrateTo(name, schemaContent)

  return db
}
