import "dotenv/config";

console.log("MONGO_URI STATUS:", process.env.MONGO_URI ? "FOUND" : "MISSING");

import app from "./app.js";
import connectDB from "./config/database.js";
import env from "./config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`BharatYatra Backend running on port ${env.port}`);
      console.log(`Server: http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();