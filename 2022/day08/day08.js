const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function isVisible(map, x, y) {
  let val = map[y][x];

  // If it's on the edge, it's visible
  if (y === 0 || x === 0 || y === map.length - 1 || x === map[0].length - 1) return true;

  // Otherwise, check each direction to see if it can reach the edge
  if (_.range(y - 1, 0, -1).every(deltaY => map[deltaY][x] < val)) return true;
  if (_.range(y + 1, map.length - 1).every(deltaY => map[deltaY][x] < val)) return true;
  if (_.range(x - 1, 0, -1).every(deltaX => map[y][deltaX] < val)) return true;
  if (_.range(x + 1, map[0].length - 1).every(deltaX => map[y][deltaX] < val)) return true;

  return false;
}

function partOne(inputs) {
  let map = inputs.map(row => row.split('').map(i => Number(i)));
  let count = 0;

  for (let y = 0; y < inputs.length; y++) {
    for (let x = 0; x < inputs.length; x++) {
      if (isVisible(map, x, y)) count++;
    }
  }

  return count;
}

function inBounds(map, x, y) {
  return x >= 0 && x < map[0].length && y >= 0 && y < map.length;
}

function treesSeenInDirection(map, x, y, deltaX, deltaY) {
  let val = map[y][x];
  let count = 0;

  for (let curX = x + deltaX, curY = y + deltaY; inBounds(map, curX, curY); curX += deltaX, curY += deltaY) {
    count++;
    if (map[curY][curX] >= val) return count;
  }

  return count;
}

function scenicScore(map, x, y) {
  let score = 1;
  for ([deltaX, deltaY] of _.ORTHOGONAL_ADJ) {
    score *= treesSeenInDirection(map, x, y, deltaX, deltaY);
  }

  return score;
}

function partTwo(inputs) {
  let map = inputs.map(row => row.split('').map(i => Number(i)));
  let bestScore = 0;

  for (let y = 0; y < inputs.length; y++) {
    for (let x = 0; x < inputs.length; x++) {
      bestScore = Math.max(bestScore, scenicScore(map, x, y));
    }
  }

  return bestScore;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };