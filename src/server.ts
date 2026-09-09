import app from "./app.js";

import { connectDB, disconnectDB } from "./config/database.js";

import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`Nuzul API running on port ${env.PORT}`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);

      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", async (err) => {
      console.error("Uncaught Exception:", err);

      await disconnectDB();
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");

      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
