import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth.routes";
import resumeRouter from "./routes/resume.routes";
import aiRouter from "./routes/ai.routes";
import { prisma } from "./config/prisma";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://jobbly-black.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRouter);

app.get("/", (_req, res) => {
  res.json({
    name: "AI Career Navigator API",
    status: "ok",
  });
});
app.get("/db-test", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Database connected",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err,
    });
  }
});
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (err: any) {
    console.error("Health check error:", err);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: err.message || "Database connection failure",
    });
  }
});

// Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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
  if (
    message.includes("already registered") ||
    message.includes("Invalid email or password")
  ) {
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

export default app;
