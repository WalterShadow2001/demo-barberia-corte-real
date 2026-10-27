import { createClient } from "@libsql/client";
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const r = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
console.log("Tables:", r.rows.map((b:any)=>b.name).join(", "));
