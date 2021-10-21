import express from "express";

import TaskWorkerPool from "./task_worker_pool.js";

const service = new TaskWorkerPool(10, {
  match: "0",
});

const app = express();

app.get("/", async (req, res) => {
  try {
    const result = await service.work(req.query.text);

    return res.json(result);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/", async (req, res) => {
  try {
    await service.setConfig({ match: req.query.match });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen("8080", () => {
  console.log("Now listening on http://localhost:8080");
});
