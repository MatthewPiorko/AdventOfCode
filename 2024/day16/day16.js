const _ = require('../../util/utils.js');

let OBJECTS = {
  START: 'S',
  END: 'E',
  WALL: '#',
  EMPTY: '.'
};

const DIRECTIONS = {
  EAST: [1, 0],
  SOUTH: [0, 1],
  WEST: [-1, 0],
  NORTH: [0, -1]
};

const TURNS = {
  '1,0': [[0, -1], [0, 1]],
  '0,1': [[-1, 0], [1, 0]],
  '-1,0': [[0, 1], [0, -1]],
  '0,-1': [[1, 0], [-1, 0]],
}

function solvePath(inputs) {
  let grid = inputs.map(row => row.split(''));

  let [startX, startY] = _.find2D(grid, OBJECTS.START);
  let [endX, endY] = _.find2D(grid, OBJECTS.END);
  grid[startY][startX] = OBJECTS.EMPTY;
  grid[endY][endX] = OBJECTS.EMPTY;

  let frontier = [[startX, startY, DIRECTIONS.EAST, 0, [[startX, startY]]]];

  let minDist = +Infinity;
  let visited = {};
  let pathsByLength = {};

  while (frontier.length > 0) {
    let [x, y, [dx, dy], dist, path] = frontier.pop();
    
    if (dist > minDist) continue;

    let visitedKey = `${x},${y},${dx},${dy}`;
    let knownBest = visited[visitedKey];

    if (knownBest !== undefined && knownBest < dist) continue;
    visited[visitedKey] = dist;

    if (x === endX && y === endY) {
      minDist = dist;
      pathsByLength[dist] = [...(pathsByLength[dist] || []), path];
      continue;
    }

    if (grid[y + dy][x + dx] === OBJECTS.EMPTY) {
      frontier.push([x + dx, y + dy, [dx, dy], dist + 1, [...path, [x, y]]]);
    }

    for (let [turnDx, turnDy] of TURNS[`${dx},${dy}`]) {
      if (grid[y + turnDy][x + turnDx] === OBJECTS.EMPTY) {
        frontier.unshift([x, y, [turnDx, turnDy], dist + 1000, [...path, [x, y]]]);
      }
    }
  }

  let bestPathNodes = new Set();
  for (let path of pathsByLength[minDist]) {
    for (let [x, y] of path) {
      bestPathNodes.add(`${x},${y}`);
    }
  }

  return [minDist, bestPathNodes.size + 1]; // also include the ending node
}

function partOne(inputs, testMode) {
  return solvePath(inputs)[0];
}

function partTwo(inputs, testMode) {
  return solvePath(inputs)[1];
}

module.exports = { partOne, partTwo };