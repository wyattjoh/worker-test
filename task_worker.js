import { Worker } from "worker_threads";
import * as uuid from "uuid";

class TaskWorker {
  constructor(cfg) {
    this.worker = new Worker("./worker.js", {
      workerData: cfg,
    });
    this.tasks = [];

    this.worker.on("message", ({ id, result, err }) => {
      const task = this.findTask(id);
      if (!task) {
        console.error(`Could not find Task["${id}"]`);
        return;
      }

      console.log(`Finished Task["${id}"]`);

      if (err) {
        return task.reject(err);
      }

      return task.resolve(result);
    });
    this.worker.on("error", (err) => {
      console.error(err);
      process.exit(1);
    });
  }

  get size() {
    return this.tasks.length;
  }

  findTask(id) {
    const idx = this.tasks.findIndex((task) => task.id === id);
    if (idx < 0) {
      return null;
    }

    const task = this.tasks[idx];

    this.tasks.splice(idx, 1);

    return task;
  }

  async setConfig(cfg) {
    return this.send({ type: "config", data: cfg });
  }

  async work(str) {
    return this.send({ type: "task", data: str });
  }

  send(msg) {
    const id = uuid.v1();

    console.log(`Queueing Task["${id}"]`);
    this.worker.postMessage({ id, ...msg });

    const promise = new Promise((resolve, reject) => {
      this.tasks.push({ id, resolve, reject });
    });

    return promise;
  }

  close() {
    this.worker.unref();
  }
}

export default TaskWorker;
