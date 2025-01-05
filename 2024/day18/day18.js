const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  BLOCK: '#'
};

function incrementGrid(grid) {
  let newGrid = _.arr2D(grid[0].length, grid.length);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== OBJECTS.EMPTY) {
        newGrid[y][x] = grid[y][x];
        continue;
      }

      // each spot is equal to the minimum of it's neighbors + 1
      let adj = _.ORTHOGONAL_ADJ
        .map(([dx, dy]) => _.safeGet2D(grid, x + dx, y + dy))
        .filter(n => !isNaN(n));
      
      let newVal = adj.length === 0 ? OBJECTS.EMPTY : _.min(adj) + 1;
      newGrid[y][x] = newVal;
    }
  }

  return newGrid;
}

const MAX_ITER = 10000;

function floodFill(inputs, rowsToRead, testMode) {
  let size = testMode ? 6 : 70;
  let grid = _.arr2D(size + 1, size + 1, OBJECTS.EMPTY);
  grid[0][0] = 0;

  for (let input of inputs.slice(0, rowsToRead)) {
    let [, x, y] = input.match(/(\d+),(\d+)/);
    grid[y][x] = OBJECTS.BLOCK;
  }

  for (let i = 0; i < MAX_ITER; i++) {
    let newGrid = incrementGrid(grid);
    if (_.arrEqual2D(newGrid, grid)) break;
    grid = newGrid;
  }

  return grid[size][size];
}

function partOne(inputs, testMode) {
  return floodFill(inputs, testMode ? 12 : 1024, testMode);
}

function partTwo(inputs, testMode) {
  // binary search for the input where all previous inputs succeed, all subsequent fail
  let min = testMode ? 12 : 1024;
  let max = inputs.length;
  let cur = Math.floor(min + (max - min) / 2);

  while (true) {
    if (max === min) return inputs[max - 1];

    let answer = floodFill(inputs, cur, testMode);
    if (answer !== OBJECTS.EMPTY) {
      min = cur + 1;
    } else {
      max = cur - 1;
    }

    cur = Math.floor(min + (max - min) / 2);
  }
}

module.exports = { partOne, partTwo };