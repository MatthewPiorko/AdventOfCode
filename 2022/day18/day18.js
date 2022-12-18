const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function isConnectedToFace(pointsMap, [x, y, z], [deltaX, deltaY, deltaZ]) {
  return pointsMap[`${x + deltaX},${y + deltaY},${z + deltaZ}`] === undefined;
}

function isExposedToOutside(pointsMap, [x, y, z], [deltaX, deltaY, deltaZ]) {
  if (!isConnectedToFace(pointsMap, [x, y, z], [deltaX, deltaY, deltaZ])) return false;

  return canReachOutside(pointsMap, [x + deltaX, y + deltaY, z + deltaZ]);
}

function numFacesMatchingCondition(inputs, checkFunc) {
  let pointsMap = {};
  let pointsList = [];

  for (let input of inputs) {
    let [_, x, y, z] = input.match(/(\d+),(\d+),(\d+)/);

    pointsMap[`${x},${y},${z}`] = true;
    pointsList.push([Number(x),Number(y),Number(z)]);
  }

  let numSidesExposed = 0;
  for (let pos of pointsList) {
    for (let dir of _.ORTHOGONAL_ADJ_3D) {
      if (checkFunc(pointsMap, pos, dir)) numSidesExposed++;
    }  
  }
  
  return numSidesExposed;
}

let cache = {};

// perform a BFS search, looking for the grid boundary
function canReachOutside(pointsMap, [startX, startY, startZ]) {
  let cacheKey = `${startX},${startY},${startZ}`;

  let frontier = [[startX, startY, startZ]];
  let visited = {};

  while (frontier.length > 0) {
    let [x,y,z] = frontier.shift();

    let curCacheKey = `${x},${y},${z}`;
    if (cache[curCacheKey] !== undefined) return cache[curCacheKey];

    if (visited[curCacheKey] !== undefined) continue;
    visited[curCacheKey] = true;

    if (x <= 0 || y <= 0 || z <= 0 || x > 20 || y > 20 || z > 20) {
      cache[cacheKey] = true;
      return true;
    }

    for (let [deltaX, deltaY, deltaZ] of _.ORTHOGONAL_ADJ_3D) {
      if (pointsMap[`${x + (deltaX)},${y + (deltaY)},${z + (deltaZ)}`] === true) continue;
      frontier.push([x + deltaX, y + deltaY, z + deltaZ]);
    }
  }

  cache[cacheKey] = false;
  return false;
}

let partOne = (inputs, testMode) => numFacesMatchingCondition(inputs, isConnectedToFace);
let partTwo = (inputs, testMode) => numFacesMatchingCondition(inputs, isExposedToOutside);

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };