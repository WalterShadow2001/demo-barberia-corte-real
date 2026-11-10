import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaInitError?: Error;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }
  // Strip authToken from URL if it's embedded
  const cleanUrl = url.split("?")[0];
  const authToken = process.env.TURSO_AUTH_TOKEN || new URL(url).searchParams.get("authToken") || undefined;
  const adapter = new PrismaLibSQL({ url: cleanUrl, authToken: authToken ?? undefined });
  return new PrismaClient({ adapter });
}

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (globalForPrisma.prismaInitError) throw globalForPrisma.prismaInitError;
  try {
    globalForPrisma.prisma = createPrismaClient();
    return globalForPrisma.prisma;
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    globalForPrisma.prismaInitError = err;
    throw err;
  }
}

const prismaProxy = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = (client as Record<string | symbol, unknown>)[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

export const prisma = prismaProxy;
