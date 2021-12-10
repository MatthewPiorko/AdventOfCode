const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const ADJ = [[-1,0],[1,0],[0,-1],[0,1]];

let isLocalMin = (map, x, y) => ADJ.every(([deltaX,deltaY]) => _.safeGet2D(map, x + deltaX, y + deltaY, Infinity) > map[y][x]);

function partOne(inputs) {
  let map = inputs.map(input => input.split('').map(Number));
  let totalRisk = 0;

  _.range(0, map.length - 1).forEach(y => {
    _.range(0, map[y].length - 1).forEach(x => {
      if (isLocalMin(map, x, y)) totalRisk += (map[y][x] + 1);
    }
  )});

  return totalRisk;
}

// Do a search from [startX, startY] to find connected points
function findNumConnectedPoints(map, startX, startY) {
  let visited = new Set();
  let stack = [[startX, startY]];

  while (stack.length > 0) {
    let [x, y] = stack.pop();
    let key = `${x},${y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    for (let [deltaX, deltaY] of ADJ) {
      let nextX = x + deltaX, nextY = y + deltaY;
      if (_.safeGet2D(map, nextX, nextY, Infinity) < 9) stack.push([nextX, nextY]);
    }
  }

  return visited.size;
}

function partTwo(inputs) {
  let map = inputs.map(input => input.split('').map(Number));
  let basinSizes = [];

  _.range(0, map.length - 1).forEach(y => {
    _.range(0, map[y].length - 1).forEach(x => {
      if (isLocalMin(map, x, y)) basinSizes.push(findNumConnectedPoints(map, x, y));
    })
  });

  basinSizes = basinSizes.sort((a,b) => b - a);
  return basinSizes[0] * basinSizes[1] * basinSizes[2];
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };