const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: ".",
  GALAXY: "#"
};

function sumOfGalaxyDistances(inputs, dilation) {
  let grid = inputs.map(row => row.split(""));

  let emptyRows = new Set(_.range(0, grid.length - 1).filter(n => grid[n].every(o => o === OBJECTS.EMPTY)));
  let emptyColumns = new Set(_.range(0, grid[0].length - 1).filter(n => _.range(0, grid.length - 1).every(row => grid[row][n] === OBJECTS.EMPTY)));

  let galaxies = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OBJECTS.GALAXY) galaxies.push([x, y]);
    }
  }

  let totalDistance = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      // distance between galaxies is the manhattan distance, but empty regions need to be traversed extra times
      for (let x = Math.min(galaxies[i][0], galaxies[j][0]); x < Math.max(galaxies[i][0], galaxies[j][0]); x++) {
        totalDistance += emptyColumns.has(x) ? dilation : 1;
      }

      for (let y = Math.min(galaxies[i][1], galaxies[j][1]); y < Math.max(galaxies[i][1], galaxies[j][1]); y++) {
        totalDistance += emptyRows.has(y) ? dilation : 1;
      }
    }
  }

  return totalDistance;
}

let partOne = (inputs, testMode) => sumOfGalaxyDistances(inputs, 2);
let partTwo = (inputs, testMode) => sumOfGalaxyDistances(inputs, testMode ? 10 : 1000000);

module.exports = { partOne, partTwo };