import "dotenv/config";
import app from "./app";
import { connectWithRetry } from "./config/prisma";

const port = Number(process.env.PORT) || 5000;

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL:", process.env.DATABASE_URL?.slice(0, 60));

async function startServer() {
  await connectWithRetry();

  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});