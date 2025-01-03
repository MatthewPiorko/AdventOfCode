const _ = require('../../util/utils.js');

function applyHikingFunction(inputs, scoringFunc) {
  let grid = inputs.map(row => row.split('').map(Number));

  let score = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== 0) continue;
      score += scoringFunc(grid, x, y);
    }
  }

  return score;
}

function findPeaks(grid, startX, startY) {
  let frontier = [[startX, startY, 0]];
  let foundPeaks = new Set();

  while (frontier.length > 0) {
    let [x, y, cur] = frontier.pop();

    if (cur === 9) {
      foundPeaks.add(`${x},${y}`);
      continue;
    }

    for (let [dx, dy] of _.ORTHOGONAL_ADJ) {
      if (_.safeGet2D(grid, x + dx, y + dy) === cur + 1) frontier.push([x + dx, y + dy, cur + 1]);
    }
  }

  return foundPeaks.size;
}

function partOne(inputs, testMode) {
  return applyHikingFunction(inputs, findPeaks);
}

function findPaths(grid, startX, startY) {
  let frontier = [[startX, startY, 0]];
  let numPaths = 0;

  while (frontier.length > 0) {
    let [x, y, cur] = frontier.pop();

    if (cur === 9) {
      numPaths++;
      continue;
    }

    for (let [dx, dy] of _.ORTHOGONAL_ADJ) {
      if (_.safeGet2D(grid, x + dx, y + dy) === cur + 1) frontier.push([x + dx, y + dy, cur + 1]);
    }
  }

  return numPaths;
}

function partTwo(inputs, testMode) {
  return applyHikingFunction(inputs, findPaths);
}

module.exports = { partOne, partTwo };