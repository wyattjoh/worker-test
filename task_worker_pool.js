import TaskWorker from "./task_worker.js";

class TaskWorkerPool {
  constructor(size, cfg) {
    if (size <= 0) {
      throw new Error("size must be at least 1");
    }

    this.workers = [];
    for (let i = 0; i < size; i++) {
      this.workers.push(new TaskWorker({ ...cfg, id: i }));
    }
  }

  async setConfig(cfg) {
    // Send the configuration to each worker!
    return Promise.all(this.workers.map((worker) => worker.setConfig(cfg)));
  }

  async work(data) {
    // Find the worker with the least amount of tasks (or zero).
    const worker = this.getWorker();

    // Send to the worker to work!
    return await worker.work(data);
  }

  getWorker() {
    let index = 0;
    let min = this.workers[0].size;
    for (let i = 0; i < this.workers.length; i++) {
      if (this.workers[i].size < min) {
        min = this.workers[i].size;
        index = i;
      }
    }

    return this.workers[index];
  }
}

export default TaskWorkerPool;
