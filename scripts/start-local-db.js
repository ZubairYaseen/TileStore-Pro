const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");
const fs = require("fs");

async function start() {
  const dbPath = path.join(__dirname, "../.data/db");
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  console.log("Starting local MongoDB server on port 27017...");
  console.log("Data directory:", dbPath);

  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbPath: dbPath,
      storageEngine: "wiredTiger",
    },
  });

  const uri = mongod.getUri();
  console.log("==================================================");
  console.log(" [SUCCESS] Local MongoDB is LIVE on port 27017!");
  console.log(" Connection URI:", uri);
  console.log("==================================================");

  // Keep process alive indefinitely
  setInterval(() => {}, 1000 * 60 * 60);

  const cleanup = async () => {
    console.log("Shutting down MongoDB...");
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

start().catch((err) => {
  console.error("Error starting local MongoDB:", err);
  process.exit(1);
});
