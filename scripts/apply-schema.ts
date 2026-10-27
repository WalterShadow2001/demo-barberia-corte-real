// scripts/apply-schema.ts
// Applies the Prisma schema directly to Turso via @libsql/client.
// (Prisma's `db push` doesn't natively support remote libsql URLs — it falls
// back to a local file. We need to run raw DDL through the libsql client.)
import { createClient } from "@libsql/client";

function env(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env var ${k}`);
  return v;
}

const client = createClient({
  url: env("TURSO_DATABASE_URL"),
  authToken: env("TURSO_AUTH_TOKEN"),
});

const DDL = [
  `DROP TABLE IF EXISTS "Reserva"`,
  `DROP TABLE IF EXISTS "HorarioBarbero"`,
  `DROP TABLE IF EXISTS "Testimonio"`,
  `DROP TABLE IF EXISTS "Barbero"`,
  `DROP TABLE IF EXISTS "Servicio"`,
  `CREATE TABLE "Servicio" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "duracionMin" INTEGER NOT NULL,
    "icono" TEXT
  )`,
  `CREATE TABLE "Barbero" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "nombre" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "activo" BOOLEAN NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE "HorarioBarbero" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "barberoId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE "Reserva" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clientePhone" TEXT NOT NULL,
    "barberoId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id"),
    FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id")
  )`,
  `CREATE TABLE "Testimonio" (
    "id" TEXT PRIMARY KEY NOT NULL,
    "autor" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT 0
  )`,
];

async function main() {
  for (const stmt of DDL) {
    await client.execute(stmt);
  }
  const r = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  console.log("Tables now:", r.rows.map((b: any) => b.name).join(", "));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
