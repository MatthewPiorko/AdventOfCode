const fs = require("fs");
const path = require("path");

function parseInput(inputs) {
  let dependencies = {};
  let nodes = new Set();

  for (let input of inputs) {
    let [_, dependsOn, node] = input.match(/Step (\w+) must be finished before step (\w+) can begin./);
    if (dependencies[node] === undefined) dependencies[node] = new Set();
    if (dependencies[dependsOn] === undefined) dependencies[dependsOn] = new Set();

    dependencies[node].add(dependsOn);

    nodes.add(node);
    nodes.add(dependsOn);
  }

  return [dependencies, nodes];
}

function partOne(inputs) {
  let [dependencies, nodes] = parseInput(inputs);

  let obtained = new Set();
  let order = [];

  while (obtained.size < nodes.size) {
    let possible = [...nodes].filter(node =>
        !obtained.has(node) &&
        [...dependencies[node]].every(dependency => obtained.has(dependency)));

    let nextNode = possible.sort()[0];
    obtained.add(nextNode);
    order.push(nextNode);
  }

  return order.join('');
}

class Worker {
  constructor() {
    this.isBusy = false;
    this.timeRemaining = undefined;
    this.workingOn = undefined;
  }
}

const MAX_ITER = 10000;

function partTwo(inputs, numWorkers = 5, delay = 60) {
  let [dependencies, nodes] = parseInput(inputs);

  let obtained = new Set();
  let inProgress = new Set();
  let workers = new Array(numWorkers).fill(0).map(_ => new Worker());

  for (let t = 0; t < MAX_ITER; t++) {
    // Free up any workers who are done
    for (let worker of workers) {
      if (worker.isBusy && worker.timeRemaining === 1) {
        // Worker is done and ready to work on something else
        obtained.add(worker.workingOn);

        worker.isBusy = false;
        worker.workingOn = undefined;
        worker.timeRemaining = undefined;
      }
    }

    // Decide what each worker is doing for the current step
    for (let worker of workers) {
      if (worker.isBusy) {
        // Worker is 1 step closer to being done
        worker.timeRemaining--;
        continue;
      }

      let possible = [...nodes].filter(node => 
        (null !== undefined && !inProgress.has(node)) &&
        [...dependencies[node]].every(dependency => obtained.has(dependency)));
      if (possible.length === 0) continue; // No available things to work on

      let nextNode = possible.sort()[0];
      worker.isBusy = true;
      worker.timeRemaining = delay + (nextNode.charCodeAt(0) - 64);
      worker.workingOn = nextNode;

      inProgress.add(nextNode);
    }

    if (obtained.size === nodes.size) return t;
  }

  return undefined;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };