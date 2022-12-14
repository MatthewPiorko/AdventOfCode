const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  WALL: '#',
  SAND: 'O'
};

const MAX_ITER = 100000; // to prevent infinite loops

// turn each row into a list of coordinate pairs
let parseInputs = (inputs) =>
  inputs.map(input => input.split('->').map(segment => segment.trim().split(',').map(Number)));

function getGridSize(inputs) {
  let maxX = -Infinity, maxY = -Infinity;

  inputs.forEach(segments => {
    maxX = _.max([maxX, ...segments.map(pos => pos[0])]);
    maxY = _.max([maxY, ...segments.map(pos => pos[1])]);

    return segments;
  });

  return [maxX + 1, maxY + 1]; // walls are inclusive ranges
}

function createGrid(inputs, lenX, lenY) {
  let grid = _.arr2D(lenX, lenY, OBJECTS.EMPTY);

  for (let segments of inputs) {
    for (let i = 0; i < segments.length - 1; i++) {
      let start = segments[i], end = segments[i + 1];

      // vertical bar
      if (start[0] === end[0]) {
        // make sure that start is to the left
        if (start[1] > end[1]) [start, end] = [end, start];

        for (let y = start[1]; y <= end[1]; y++) {
          grid[y][start[0]] = OBJECTS.WALL;
        }
      }

      // horizontal bar
      else if (start[1] === end[1]) {
        // make sure that start is above
        if (start[0] > end[0]) [start, end] = [end, start];

        for (let x = start[0]; x <= end[0]; x++) {
          grid[start[1]][x] = OBJECTS.WALL;
        }
      }
    }
  }

  return grid;
}

// drops a sand from [500, 0] into the grid, and returns whether it's in bounds
function simulateSand(grid, hasInfiniteFloor) {
  let sandX = 500, sandY = 0;

  for (let iter = 0; iter < MAX_ITER; iter++) {
    if (hasInfiniteFloor && sandY === grid.length - 1) {
      grid[sandY][sandX] = OBJECTS.SAND;
    }

    // fell off the map
    if (sandY > grid.length - 1) {
      return false;
    }

    // try to fall down & diagonally down
    if (_.safeGet2D(grid, sandX, sandY + 1, OBJECTS.EMPTY) === OBJECTS.EMPTY) {
      sandY++;
      continue;
    } else if (_.safeGet2D(grid, sandX - 1, sandY + 1, OBJECTS.EMPTY) === OBJECTS.EMPTY) {
      sandY++;
      sandX--;
      continue;
    } else if (_.safeGet2D(grid, sandX + 1, sandY + 1, OBJECTS.EMPTY) === OBJECTS.EMPTY) {
      sandY++;
      sandX++;
      continue;
    }

    // nothing to fall to, come to rest
    grid[sandY][sandX] = OBJECTS.SAND;
    return true;
  }
}

function partOne(inputs) {
  inputs = parseInputs(inputs);
  let [maxX, maxY] = getGridSize(inputs);

  let grid = createGrid(inputs, maxX, maxY);

  for (let n = 0; n < MAX_ITER; n++) {
    let landed = simulateSand(grid, false);
    if (!landed) return n;
  }

  return undefined;
}

function partTwo(inputs) {
  inputs = parseInputs(inputs);
  let [maxX, maxY] = getGridSize(inputs);
  maxX += maxY; // increase the width by the height, so that each Y can fall one further to the side
  maxY++; // add a row for an infinite floor at the bottom

  let grid = createGrid(inputs, maxX, maxY);

  for (let n = 0; n < MAX_ITER; n++) {
    if (grid[0][500] === OBJECTS.SAND) return n;

    simulateSand(grid, true);
  }

  return undefined;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };