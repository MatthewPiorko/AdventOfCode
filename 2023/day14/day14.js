const _ = require('../../util/utils.js');

const OBJECTS = {
  ROUND: 'O',
  CUBE: '#',
  EMPTY: '.'
};

function partOne(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));
  return getTotalLoad(fallUpwards(grid));
}

function fallUpwards(grid) {
  let newGrid = [];
  for (let y = 0; y < grid.length; y++) {
    row = [];
    for (let x = 0; x < grid[y].length; x++) {
      // only roll round rocks
      if (grid[y][x] !== OBJECTS.ROUND) {
        row.push(grid[y][x]);
        continue;
      }

      let newY = y;
      while (_.safeGet2D(grid, x, newY - 1, OBJECTS.CUBE) === OBJECTS.EMPTY) newY--;

      if (newY !== y) {
        // roll the rock up to the first open position
        grid[newY][x] = OBJECTS.ROUND;
        newGrid[newY][x] = OBJECTS.ROUND;

        grid[y][x] = OBJECTS.EMPTY;
        row.push(OBJECTS.EMPTY);
      } else {
        // rock couldn't roll
        row.push(OBJECTS.ROUND);
      }
    }

    newGrid.push(row);
  }

  return newGrid;
}

function getTotalLoad(grid) {
  return _.sum(grid.map((row, y) => {
    return _.sum(row.map(o => o === OBJECTS.ROUND ? grid.length - y : 0));
  }));
}

// rather than write 4 "fall" methods (or do proper abstraction), just spin the entire grid
function rotateClockwise(grid) {
  let newGrid = [];

  for (let x = 0; x < grid[0].length; x++) {
    let row = [];
    for (let y = grid.length - 1; y >= 0; y--) {
      row.push(grid[y][x]);
    }
    newGrid.push(row);
  }
  return newGrid;
}

function partTwo(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));
  let numIter = 1000000000;
  let cache = {};

  for (let i = 0; i < numIter; i++) {
    // run a spin cycle
    for (let i = 0; i < 4; i++) {
      grid = fallUpwards(grid);
      grid = rotateClockwise(grid);
    }

    // try to skip ahead cycles if there's been a repeat
    let cacheKey = grid.map(row => row.join('')).join('');

    if (cache[cacheKey] !== undefined) {
      let cycleLength = i - cache[cacheKey];
      i += cycleLength * Math.floor((numIter - i) / cycleLength);
    } else {
      cache[cacheKey] = i;
    }
  }

  return getTotalLoad(grid);
}

module.exports = { partOne, partTwo };