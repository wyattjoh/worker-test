import fetch from "node-fetch";
import wait from "./wait.js";

const REQUESTS = 100;

async function main() {
  await fetch("http://localhost:8080/?match=5", { method: "POST" });

  await wait(2000);

  const tasks = [];
  for (let i = 0; i < REQUESTS; i++) {
    tasks.push(
      fetch(`http://localhost:8080/?text=${i}`)
        .then(async (res) => {
          if (!res.ok) {
            console.log(await res.text());
            return;
          }

          const json = await res.json();
          if (json.result.result) {
            console.log(JSON.stringify(json));
          }
        })
        .catch((err) => {
          console.error(err);
        })
    );
  }

  console.log("finished loading tasks");
  await Promise.all(tasks);
  console.log("finished");
}

main();
