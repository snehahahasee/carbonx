const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Emission = require("../models/Emission");
const Transaction = require("../models/Transaction");
const { summarizeEmission, createCertificateHash } = require("../logic/carbon");

function publicUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  const { password, __v, ...safeUser } = obj;
  return { ...safeUser, id: String(obj._id || obj.id) };
}

function buildEmission(user_id, input) {
  const summary = summarizeEmission(input);
  return {
    user_id,
    electricity: input.electricity,
    fuel: input.fuel,
    transport: input.transport,
    total_emissions: summary.total_emissions,
    carbon_score: summary.carbon_score,
    certificate_hash: createCertificateHash(),
    reduced_emissions: summary.reduced_emissions
  };
}

async function seedMongo() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const password = await bcrypt.hash("password123", 10);
  const users = await User.create([
    {
      name: "Aarav Precision Works",
      email: "factory@carbonx.demo",
      password,
      business_type: "factory"
    },
    {
      name: "Green Bowl Kitchen",
      email: "restaurant@carbonx.demo",
      password,
      business_type: "restaurant"
    }
  ]);

  await Emission.create([
    buildEmission(users[0]._id, { electricity: 620, fuel: 160, transport: 780 }),
    buildEmission(users[1]._id, { electricity: 280, fuel: 70, transport: 210 })
  ]);

  await Transaction.create([
    { user_id: users[0]._id, credits: 12, type: "sell" },
    { user_id: users[1]._id, credits: 6, type: "buy" }
  ]);
}

function createMongoRepository() {
  return {
    mode: "mongodb",
    async findUserByEmail(email) {
      return User.findOne({ email: email.toLowerCase() });
    },
    async findUserById(userId) {
      return User.findById(userId);
    },
    async createUser(payload) {
      const user = await User.create({
        ...payload,
        email: payload.email.toLowerCase(),
        password: await bcrypt.hash(payload.password, 10)
      });
      await Emission.create(buildEmission(user._id, { electricity: 340, fuel: 90, transport: 260 }));
      return user;
    },
    async createEmission(userId, input) {
      return Emission.create(buildEmission(userId, input));
    },
    async latestEmission(userId) {
      return Emission.findOne({ user_id: userId }).sort({ createdAt: -1 });
    },
    async listEmissions(userId) {
      return Emission.find({ user_id: userId }).sort({ createdAt: -1 });
    },
    async createTransaction(userId, credits, type) {
      return Transaction.create({ user_id: userId, credits, type });
    },
    async listTransactions(userId) {
      return Transaction.find({ user_id: userId }).sort({ createdAt: -1 });
    },
    publicUser
  };
}

module.exports = { createMongoRepository, seedMongo };
