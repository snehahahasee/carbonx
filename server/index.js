const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { port, clientUrl, jwtSecret } = require("./config");
const { createRepository } = require("./repository");
const { summarizeEmission } = require("./logic/carbon");

const marketplace = [
  {
    id: "market-1",
    title: "Solar Offset Bundle",
    location: "Rajasthan Solar Park",
    credits: 40,
    price: 690,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "market-2",
    title: "Efficient Logistics Credits",
    location: "Western Freight Corridor",
    credits: 25,
    price: 740,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "market-3",
    title: "Warehouse Retrofit Pool",
    location: "Bengaluru Industrial Cluster",
    credits: 32,
    price: 715,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
  }
];

function normalizeEmission(emission) {
  const obj = emission && emission.toObject ? emission.toObject() : emission;
  if (!obj) return null;
  return {
    ...obj,
    id: String(obj._id || obj.id),
    user_id: String(obj.user_id)
  };
}

function normalizeTx(tx) {
  const obj = tx && tx.toObject ? tx.toObject() : tx;
  return {
    ...obj,
    id: String(obj._id || obj.id),
    user_id: String(obj.user_id)
  };
}

function tokenFor(user) {
  return jwt.sign({ id: String(user._id || user.id) }, jwtSecret, { expiresIn: "7d" });
}

async function main() {
  const app = express();
  const repo = await createRepository();
  const isProduction = process.env.NODE_ENV === "production";

  app.use(cors({ origin: isProduction ? true : clientUrl, credentials: true }));
  app.use(express.json());

  async function auth(req, res, next) {
    try {
      const header = req.headers.authorization || "";
      const token = header.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Missing token" });
      const decoded = jwt.verify(token, jwtSecret);
      const user = await repo.findUserById(decoded.id);
      if (!user) return res.status(401).json({ message: "Invalid token" });
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Please log in again" });
    }
  }

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, store: repo.mode });
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password, business_type } = req.body;
    if (!name || !email || !password || !business_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await repo.findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const user = await repo.createUser({ name, email, password, business_type });
    res.json({ token: tokenFor(user), user: repo.publicUser(user) });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await repo.findUserByEmail(email || "");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password || "", user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    res.json({ token: tokenFor(user), user: repo.publicUser(user) });
  });

  app.get("/api/me", auth, async (req, res) => {
    res.json({ user: repo.publicUser(req.user) });
  });

  app.get("/api/dashboard", auth, async (req, res) => {
    const userId = String(req.user._id || req.user.id);
    const latest = normalizeEmission(await repo.latestEmission(userId));
    const transactions = (await repo.listTransactions(userId)).map(normalizeTx);
    const summary = latest ? summarizeEmission(latest) : summarizeEmission({ electricity: 0, fuel: 0, transport: 0 });
    const creditsFromTransactions = transactions.reduce((sum, tx) => sum + (tx.type === "buy" ? tx.credits : -tx.credits), 0);
    const earnedCredits = summary.credits;

    res.json({
      user: repo.publicUser(req.user),
      latestEmission: latest,
      summary,
      wallet: {
        creditsEarned: earnedCredits,
        balance: Number((earnedCredits + creditsFromTransactions).toFixed(1)),
        rupeeEquivalent: Math.round((earnedCredits + creditsFromTransactions) * 720)
      },
      transactions
    });
  });

  app.post("/api/emissions", auth, async (req, res) => {
    const input = {
      electricity: Number(req.body.electricity || 0),
      fuel: Number(req.body.fuel || 0),
      transport: Number(req.body.transport || 0)
    };

    const emission = normalizeEmission(await repo.createEmission(String(req.user._id || req.user.id), input));
    res.json({ emission, summary: summarizeEmission(input) });
  });

  app.get("/api/marketplace", auth, (req, res) => {
    res.json({ listings: marketplace });
  });

  app.post("/api/transactions", auth, async (req, res) => {
    const credits = Number(req.body.credits || 0);
    const type = req.body.type === "sell" ? "sell" : "buy";
    if (credits <= 0) return res.status(400).json({ message: "Credits must be greater than zero" });

    const tx = normalizeTx(await repo.createTransaction(String(req.user._id || req.user.id), credits, type));
    res.json({ transaction: tx, message: `${type === "buy" ? "Bought" : "Listed"} ${credits} credits successfully` });
  });

  if (isProduction) {
    const clientDist = path.join(__dirname, "..", "client", "dist");
    app.use(express.static(clientDist));
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  const host = isProduction ? "0.0.0.0" : "127.0.0.1";
  app.listen(port, host, () => {
    console.log(`CarbonX API running on http://${host === "0.0.0.0" ? "127.0.0.1" : host}:${port}`);
  });
}

main();
