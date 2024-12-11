const _ = require('../../util/utils.js');

function countXMAS(grid, x, y) {
  if (grid[y][x] !== "X") return 0;

  let numXmas = 0;

  // test every direction coming out of the X
  for (let [dx, dy] of _.ADJ) {
    if (_.safeGet2D(grid, x + dx, y + dy) === "M" &&
        _.safeGet2D(grid, x + dx * 2, y + dy * 2) === "A" &&
        _.safeGet2D(grid, x + dx * 3, y + dy * 3) === "S") numXmas++;
  }

  return numXmas;
}

function partOne(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));
  let numXmas = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      numXmas += countXMAS(grid, x, y);
    }
  }

  return numXmas;

}

function isX_MAS(grid, x, y) {
  if (grid[y][x] !== "A") return 0;

  // both diagonals from the "A" should be "MS" or "SM"
  let diag1 = [_.safeGet2D(grid, x - 1, y - 1), _.safeGet2D(grid, x + 1, y + 1)].sort().join("");
  let diag2 = [_.safeGet2D(grid, x + 1, y - 1), _.safeGet2D(grid, x - 1, y + 1)].sort().join("");

  return diag1 === "MS" && diag2 === "MS";
}

function partTwo(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));

  let numX_mas = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (isX_MAS(grid, x, y)) numX_mas++;
    }
  }

  return numX_mas;
}

module.exports = { partOne, partTwo };