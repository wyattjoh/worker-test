import { parentPort, workerData } from "worker_threads";
import wait from "./wait.js";

function handle(fn, st) {
  async function process({ type, data }) {
    switch (type) {
      case "task":
        return fn(data);
      case "config":
        return st(data);
    }
  }

  parentPort.on("message", async ({ id, type, data }) => {
    try {
      const result = await process({ type, data });

      return parentPort.postMessage({ id, result });
    } catch (err) {
      return parentPort.postMessage({ id, err });
    }
  });
}

let config = workerData;

console.log(`Started Worker: ${JSON.stringify(config)}`);

handle(
  async (str) => {
    const start = Date.now();

    await wait(Math.floor(Math.random() * 1000));

    const took = Date.now() - start;

    if (str === config.match) {
      return { str, took, result: true };
    }

    return { str, took, result: false };
  },
  async (cfg) => {
    config = { ...config, ...cfg };
    console.log(`Config: ${JSON.stringify(config)}`);
  }
);
