const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  PAPER: '@'
};

function partOne(inputs, testMode) {
  let grid = inputs.map(input => input.split(''));
  return pickUpPaper(grid)[1];
}

function partTwo(inputs, testMode) {
  let grid = inputs.map(input => input.split(''));
  let totalAccessible = 0;

  while (true) {
    let [newGrid, numAccessible] = pickUpPaper(grid);
    totalAccessible += numAccessible;

    if (_.arrEqual2D(grid, newGrid)) return totalAccessible;

    grid = newGrid;
  }
}

function pickUpPaper(grid) {
  let newGrid = grid.map(row => row.map(x => x));
  let numAccessible = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== OBJECTS.PAPER) continue;

      let numAdj = 0;
      for (let [dx, dy] of _.ADJ) {
        if (_.safeGet2D(grid, x + dx, y + dy, OBJECTS.EMPTY) === OBJECTS.PAPER) numAdj++;
      }

      if (numAdj < 4) {
        newGrid[y][x] = OBJECTS.EMPTY;
        numAccessible++;
      }
    }
  }

  return [newGrid, numAccessible];
}

module.exports = { partOne, partTwo };