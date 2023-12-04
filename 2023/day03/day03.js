const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: ".",
  GEAR: "*"
};

function partOne(inputs, testMode) {
  let grid = inputs.map(input => input.split(""));
  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!isNaN(grid[y][x])) {
        let num = findFullNumber(grid, x, y);
        let length = String(num).length;

        if (hasAdjacentObject(grid, x, y, length)) sum += Number(num);

        x += length;
      }
    }
  }

  return sum;
}

// find if there is any symbol adjacent to a number of length at (x,y)
function hasAdjacentObject(grid, x, y, length) {
  // check above
  for (let dx = -1; dx < length + 1; dx++) {
    if (_.safeGet2D(grid, x + dx, y - 1, OBJECTS.EMPTY) != OBJECTS.EMPTY) return true;
  }

  // check left & right
  if (_.safeGet2D(grid, x - 1, y, OBJECTS.EMPTY) != OBJECTS.EMPTY) return true;
  if (_.safeGet2D(grid, x + length, y, OBJECTS.EMPTY) != OBJECTS.EMPTY) return true;

  // check below
  for (let dx = -1; dx < length + 1; dx++) {
    if (_.safeGet2D(grid, x + dx, y + 1, OBJECTS.EMPTY) != OBJECTS.EMPTY) return true;
  }

  return false;
}

function partTwo(inputs, testMode) {
  let grid = inputs.map(input => input.split(""));
  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OBJECTS.GEAR) {
        let adj = findAdjacentNumbers(grid, x, y);
        if (adj.length == 2) sum += (adj[0] * adj[1]);
      }
    }
  }

  return sum;
}

function findAdjacentNumbers(grid, x, y) {
  let adjacent = new Set();
  for (let [dx, dy] of _.ADJ) {
    if (!isNaN(grid[y + dy][x + dx])) {
      adjacent.add(findFullNumber(grid, x + dx, y + dy));  
    }
  }

  return Array.from(adjacent);
}

// given a digit at (x,y), find the full number around it
function findFullNumber(grid, x, y) {
  let num = grid[y][x];

  // digit to the left
  if (!isNaN(grid[y][x - 1])) {
    num = grid[y][x - 1] + num;
    let delta = 1;

    while (!isNaN(grid[y][x - 1 - delta])) {
      num = grid[y][x - 1 - delta] + num;
      delta++;
    }
  }

  // digits to the right
  if (!isNaN(grid[y][x + 1])) {
    num = num + grid[y][x + 1];
    let delta = 1;
    
    while (!isNaN(grid[y][x + 1 + delta])) {
      num = num + grid[y][x + 1 + delta];
      delta++;
    }
  }

  return Number(num);
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };