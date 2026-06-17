import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Enable detailed logging
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
      { emit: "event", level: "info" },
      { emit: "event", level: "query" },
    ],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Bind log events
(prisma as any).$on("error", (e: any) => {
  console.error("🔴 Prisma Database Error:", e.message || e);
});

(prisma as any).$on("warn", (e: any) => {
  console.warn("⚠️ Prisma Database Warning:", e.message || e);
});

(prisma as any).$on("info", (e: any) => {
  console.log("ℹ️ Prisma Database Info:", e.message || e);
});

(prisma as any).$on("query", (e: any) => {
  // Can log query in development if needed
});

// Database connectivity check and reconnection logic
export async function connectWithRetry(retries = 5, delay = 2000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log("✅ Prisma connection verified successfully.");
      return;
    } catch (err: any) {
      console.error(`❌ Prisma connection attempt ${i + 1}/${retries} failed:`, err.message || err);
      if (i < retries - 1) {
        console.log(`Waiting ${delay / 1000}s before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error("🔴 All Prisma connection attempts failed.");
}