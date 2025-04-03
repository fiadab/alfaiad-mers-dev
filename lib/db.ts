import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
} else {
  // Warm connection for production
  db.$connect().catch((error) => {
    console.error("Prisma connection error:", error);
    process.exit(1);
  });
}