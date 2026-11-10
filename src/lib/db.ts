import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./db/barberia.db";
  return new PrismaClient({
    datasources: { db: { url } },
  });
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  globalForPrisma.prisma = createPrismaClient();
  return globalForPrisma.prisma;
}

/** Lazy proxy so the client is only created on first property access. */
const prismaProxy = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = (client as Record<string | symbol, unknown>)[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

export { prismaProxy as prisma };
