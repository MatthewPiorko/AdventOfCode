const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  LEFT_MIRROR: '/',
  RIGHT_MIRROR: '\\',
  VERTICAL_SPLITTER: '|',
  HORIZONTAL_SPLITTER: '-'
};

const UP = [0, -1];
const DOWN = [0, 1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];

function partOne(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));

  return numEnergized(grid, [[-1, 0], RIGHT]);
}

function numEnergized(grid, start) {
  const energized = {};
  const visited = {};

  // beams is an array of particles
  // a particle is an array of [position, velocity]
  let beams = [start];

  while (beams.length > 0) {
    let [[x,y], [velX, velY]] = beams.shift();

    energized[`${x},${y}`] = true;

    // prevent infinite loops
    let visitedHash = `${x},${y},${velX},${velY}`;
    if (visited[visitedHash]) continue;
    visited[visitedHash] = true;

    let nextObj = _.safeGet2D(grid, x + velX, y + velY, undefined);
    // beam is leaving grid
    if (nextObj === undefined) continue;

    let newPos = [x + velX, y + velY];

    if (nextObj === OBJECTS.LEFT_MIRROR) {
      if (velX === 1) beams.push([newPos, UP]);
      if (velX === -1) beams.push([newPos, DOWN]);
      if (velY === 1) beams.push([newPos, LEFT]);
      if (velY === -1) beams.push([newPos, RIGHT]);
    }
    else if (nextObj === OBJECTS.RIGHT_MIRROR) {
      if (velX === 1) beams.push([newPos, DOWN]);
      if (velX === -1) beams.push([newPos, UP]);
      if (velY === 1) beams.push([newPos, RIGHT]);
      if (velY === -1) beams.push([newPos, LEFT]);
    }
    else if (nextObj === OBJECTS.VERTICAL_SPLITTER) {
      if (velX !== 0) {
        beams.push([newPos, UP]);
        beams.push([newPos, DOWN]);
      } else {
        beams.push([newPos, [velX, velY]]);
      }
    }
    else if (nextObj === OBJECTS.HORIZONTAL_SPLITTER) {
      if (velY !== 0) {
        beams.push([newPos, LEFT]);
        beams.push([newPos, RIGHT]);
      } else {
        beams.push([newPos, [velX, velY]]);
      }
    } else {
      beams.push([newPos, [velX, velY]]);
    }
  }

  // ignore the starting position off the grid
  return Object.keys(energized).length - 1;
}

function partTwo(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));
  let best = -Infinity;

  // fire from left and right sides
  for (let y = 0; y < grid.length; y++) {
    best = Math.max(best, numEnergized(grid, [[-1, y], RIGHT]));
    best = Math.max(best, numEnergized(grid, [[grid.length, y], LEFT]));
  }

  // fire from top and bottom
  for (let x = 0; x < grid[0].length; x++) {
    best = Math.max(best, numEnergized(grid, [[x, -1], DOWN]));
    best = Math.max(best, numEnergized(grid, [[x, grid[0].length], UP]));
  }

  return best;
}

module.exports = { partOne, partTwo };