const mongoose = require("mongoose");
const { mongoUri } = require("./config");
const { seedMongo } = require("./store/mongoStore");
const { seedLocal } = require("./store/localStore");

async function run() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1200 });
    await mongoose.connection.dropDatabase();
    await seedMongo();
    console.log("Seeded MongoDB demo data");
  } catch (error) {
    seedLocal();
    console.log("Seeded local JSON demo data because MongoDB was unavailable");
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

run();
