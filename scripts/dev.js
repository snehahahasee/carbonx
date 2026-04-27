const { spawn } = require("child_process");
const net = require("net");
const path = require("path");

const root = path.resolve(__dirname, "..");
const node = process.execPath;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function findOpenPort(start) {
  for (let port = start; port < start + 30; port += 1) {
    if (await isPortFree(port)) return port;
  }

  throw new Error(`No open port found starting at ${start}`);
}

function run(name, entry, args, cwd, env = {}) {
  const child = spawn(node, [entry, ...args], {
    cwd,
    stdio: "inherit",
    shell: false,
    env: { ...process.env, ...env, FORCE_COLOR: "1" }
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exitCode = code;
    }
  });

  return child;
}

async function main() {
  const apiPort = await findOpenPort(Number(process.env.PORT || 5000));
  const webPort = await findOpenPort(Number(process.env.CLIENT_PORT || 5173));
  const apiUrl = `http://127.0.0.1:${apiPort}`;
  const clientUrl = `http://127.0.0.1:${webPort}`;
  const sharedEnv = {
    PORT: String(apiPort),
    CLIENT_URL: clientUrl,
    VITE_API_URL: `${apiUrl}/api`
  };

  console.log(`CarbonX API will run on ${apiUrl}`);
  console.log(`CarbonX web app will run on ${clientUrl}`);

  const api = run("api", path.join(root, "server", "index.js"), [], root, sharedEnv);
  const web = run(
    "web",
    path.join(root, "client", "node_modules", "vite", "bin", "vite.js"),
    ["--host", "127.0.0.1", "--port", String(webPort), "--strictPort"],
    path.join(root, "client"),
    sharedEnv
  );

  function shutdown() {
    api.kill();
    web.kill();
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
