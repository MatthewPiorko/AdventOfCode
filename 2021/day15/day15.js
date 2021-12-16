const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const CLOSER_TO_END = [[0,1],[1,0]];

// Build a table that is the minimum path when only ever going down and right
function buildMinTable(map) {
  let minTable = _.arr2D(map.length, map.length, 0);
  minTable[map.length - 1][map.length - 1] = map[map.length - 1][map.length - 1];

  _.range(map.length - 1, 0, -1).forEach(y =>
    _.range(map.length - 1, 0, -1).forEach(x => {
      if (x === map.length - 1 && y === map.length - 1) return;

      let adj = CLOSER_TO_END.map(([deltaX, deltaY]) => _.safeGet2D(minTable, x + deltaX, y + deltaY)).filter(val => val !== undefined);
      minTable[y][x] = _.min(adj) + map[y][x];
    }));

  return minTable;
}

const ADJ = [[-1,0],[1,0],[0,-1],[0,1]];
const MAX_ITER = 100;

// Find the optimal cost from the top left to the bottom right
// Set every cell as the minimum of its neighbors until it converges
function search(map) {
  // Build a "best guess" that will be iterated over
  let costMap = buildMinTable(map);
  let previousAnswers = [];

  for (let i = 0; i < MAX_ITER; i++) {
    // Iterate backwards to propogate changes from the bottom right to the top left faster
    for (let y = map.length - 1; y >= 0; y--) {
      for (let x = map.length - 1; x >= 0; x--) {
        if (x === map[y].length - 1 && y === map.length - 1) continue; // The bottom right can never be changed

        let adj = ADJ.map(([deltaX, deltaY]) => _.safeGet2D(costMap, x + deltaX, y + deltaY, undefined)).filter(val => val !== undefined);

        costMap[y][x] = _.min(adj) + map[y][x];
      }
    }

    // If the top left has stayed the same for 3 iterations, it's *probably* converged
    if (i > 3 && previousAnswers.slice(previousAnswers.length - 3).every(answer => answer === costMap[0][0])) return costMap[0][0] - map[0][0];
    previousAnswers.push(costMap[0][0]);
  }

  return undefined;
}

function partOne(inputs) {
  inputs = inputs.map(row => row.split('').map(Number));
  let minTable = buildMinTable(inputs);
  return minTable[0][0] - inputs[0][0]; // For part one, only going right and down is necessary
}

function partTwo(inputs) {
  inputs = inputs.map(row => row.split('').map(Number));

  // Tile input 4 times vertically
  inputs = _.range(0, 4)
    .map(i => inputs.map(row => row.map(x => x + i > 9 ? x + i - 9 : x + i)))
    .reduce((acc, map) => acc.concat(map), []);

  // Tile input 4 times horizontally
  inputs = inputs.map(row =>
    _.range(0, 4).map(i => row.map(x => x + i > 9 ? x + i - 9 : x + i)).reduce((acc, row) => acc.concat(row), []));

  return search(inputs);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };