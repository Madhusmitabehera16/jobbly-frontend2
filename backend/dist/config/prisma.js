"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectWithRetry = connectWithRetry;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
// Enable detailed logging
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        log: [
            { emit: "event", level: "error" },
            { emit: "event", level: "warn" },
            { emit: "event", level: "info" },
            { emit: "event", level: "query" },
        ],
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
// Bind log events
exports.prisma.$on("error", (e) => {
    console.error("🔴 Prisma Database Error:", e.message || e);
});
exports.prisma.$on("warn", (e) => {
    console.warn("⚠️ Prisma Database Warning:", e.message || e);
});
exports.prisma.$on("info", (e) => {
    console.log("ℹ️ Prisma Database Info:", e.message || e);
});
exports.prisma.$on("query", (e) => {
    // Can log query in development if needed
});
// Database connectivity check and reconnection logic
async function connectWithRetry(retries = 5, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await exports.prisma.$connect();
            console.log("✅ Prisma connection verified successfully.");
            return;
        }
        catch (err) {
            console.error(`❌ Prisma connection attempt ${i + 1}/${retries} failed:`, err.message || err);
            if (i < retries - 1) {
                console.log(`Waiting ${delay / 1000}s before retrying...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    console.error("🔴 All Prisma connection attempts failed.");
}
//# sourceMappingURL=prisma.js.map