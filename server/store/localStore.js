const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { summarizeEmission, createCertificateHash } = require("../logic/carbon");

const dataDir = path.join(__dirname, "..", "data");
const dataPath = path.join(dataDir, "local-db.json");

function id(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function readDb() {
  if (!fs.existsSync(dataPath)) {
    seedLocal();
  }

  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeDb(db) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
}

function buildEmission(user_id, input) {
  const summary = summarizeEmission(input);
  return {
    id: id("em"),
    user_id,
    electricity: input.electricity,
    fuel: input.fuel,
    transport: input.transport,
    total_emissions: summary.total_emissions,
    carbon_score: summary.carbon_score,
    certificate_hash: createCertificateHash(),
    reduced_emissions: summary.reduced_emissions,
    createdAt: new Date().toISOString()
  };
}

function seedLocal() {
  const factoryPass = bcrypt.hashSync("password123", 10);
  const restaurantPass = bcrypt.hashSync("password123", 10);
  const factory = {
    id: "user_factory_demo",
    name: "Aarav Precision Works",
    email: "factory@carbonx.demo",
    password: factoryPass,
    business_type: "factory"
  };
  const restaurant = {
    id: "user_restaurant_demo",
    name: "Green Bowl Kitchen",
    email: "restaurant@carbonx.demo",
    password: restaurantPass,
    business_type: "restaurant"
  };

  const db = {
    users: [factory, restaurant],
    emissions: [
      buildEmission(factory.id, { electricity: 620, fuel: 160, transport: 780 }),
      buildEmission(restaurant.id, { electricity: 280, fuel: 70, transport: 210 })
    ],
    transactions: [
      { id: id("tx"), user_id: factory.id, credits: 12, type: "sell", createdAt: new Date().toISOString() },
      { id: id("tx"), user_id: restaurant.id, credits: 6, type: "buy", createdAt: new Date().toISOString() }
    ]
  };

  writeDb(db);
  return db;
}

function createLocalRepository() {
  seedLocal();

  return {
    mode: "local-json",
    async findUserByEmail(email) {
      return readDb().users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
    },
    async findUserById(userId) {
      return readDb().users.find((user) => user.id === userId) || null;
    },
    async createUser(payload) {
      const db = readDb();
      const user = {
        id: id("user"),
        ...payload,
        password: await bcrypt.hash(payload.password, 10)
      };
      db.users.push(user);
      const emission = buildEmission(user.id, { electricity: 340, fuel: 90, transport: 260 });
      db.emissions.push(emission);
      writeDb(db);
      return user;
    },
    async createEmission(userId, input) {
      const db = readDb();
      const emission = buildEmission(userId, input);
      db.emissions.unshift(emission);
      writeDb(db);
      return emission;
    },
    async latestEmission(userId) {
      const db = readDb();
      return db.emissions
        .filter((emission) => emission.user_id === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
    },
    async listEmissions(userId) {
      return readDb().emissions.filter((emission) => emission.user_id === userId);
    },
    async createTransaction(userId, credits, type) {
      const db = readDb();
      const transaction = { id: id("tx"), user_id: userId, credits, type, createdAt: new Date().toISOString() };
      db.transactions.unshift(transaction);
      writeDb(db);
      return transaction;
    },
    async listTransactions(userId) {
      return readDb().transactions.filter((tx) => tx.user_id === userId);
    },
    publicUser
  };
}

module.exports = { createLocalRepository, seedLocal, publicUser };
