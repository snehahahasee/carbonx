# CarbonX

CarbonX is a full-stack climate-fintech prototype for SMEs to track emissions, get a Carbon Score, receive sustainability recommendations, earn simulated carbon credits, and trade credits in a mock marketplace.

## Run Locally

```bash
npm.cmd run carbonx
```

If dependencies are already installed, use the faster dev command:

```bash
npm.cmd run dev
```

Open `http://127.0.0.1:5173`.

The API tries to connect to MongoDB at `mongodb://127.0.0.1:27017/carbonx`. If MongoDB is not running, CarbonX automatically uses a local JSON-backed demo store at `server/data/local-db.json`, seeded with the same demo users.

## Demo Accounts

- `factory@carbonx.demo` / `password123`
- `restaurant@carbonx.demo` / `password123`

## Tech

- React + Tailwind CSS
- Node.js + Express
- MongoDB models via Mongoose with seeded demo data
