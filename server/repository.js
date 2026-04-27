const mongoose = require("mongoose");
const { mongoUri } = require("./config");
const { createMongoRepository, seedMongo } = require("./store/mongoStore");
const { createLocalRepository } = require("./store/localStore");

async function createRepository() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1200 });
    await seedMongo();
    console.log("CarbonX API connected to MongoDB");
    return createMongoRepository();
  } catch (error) {
    console.log("MongoDB unavailable, using local seeded JSON store");
    return createLocalRepository();
  }
}

module.exports = { createRepository };
