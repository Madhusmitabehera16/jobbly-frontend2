"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const prisma_1 = require("./config/prisma");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app"
    ],
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/resume", resume_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.get("/", (_req, res) => {
    res.json({
        name: "AI Career Navigator API",
        status: "ok",
    });
});
app.get("/db-test", async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({
            success: true,
            message: "Database connected",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err,
        });
    }
});
app.get("/health", async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({
            status: "ok",
            database: "connected",
        });
    }
    catch (err) {
        console.error("Health check error:", err);
        res.status(500).json({
            status: "error",
            database: "disconnected",
            message: err.message || "Database connection failure",
        });
    }
});
// Centralized Error Handler
app.use((err, _req, res, _next) => {
    console.error("API Error:", err);
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    // Check for duplicate key / database errors if needed (e.g. Prisma P2002)
    if (err.code === "P2002") {
        res.status(400).json({
            success: false,
            message: "An account with this email already exists.",
        });
        return;
    }
    // Handle service-thrown custom error messages with status code 400
    if (message.includes("already registered") ||
        message.includes("Invalid email or password")) {
        res.status(400).json({
            success: false,
            message,
        });
        return;
    }
    res.status(status).json({
        success: false,
        message,
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map