const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  WALL: '#',
  UP: '^',
  RIGHT: '>',
  DOWN: 'v',
  LEFT: '<',
  ELF: 'E'
};

const BLIZZARDS = [OBJECTS.UP, OBJECTS.RIGHT, OBJECTS.DOWN, OBJECTS.LEFT];

function parseGrid(inputs) {
  let grid = inputs.map(row => row.split(''));
  let startX = grid[0].findIndex(v => v === OBJECTS.EMPTY);
  goalX = grid[grid.length - 1].findIndex(v => v === OBJECTS.EMPTY), goalY = grid.length - 1;

  let originalBlizzards = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (BLIZZARDS.some(o => grid[y][x] === o)) {
        originalBlizzards.push([x, y, grid[y][x]]);
        grid[y][x] = OBJECTS.EMPTY;
      }
    }
  }

  let blizzardsByTime = genereateBlizzardsByTime(grid, originalBlizzards);

  return [grid, blizzardsByTime, startX, goalX, goalY];
}

function hashState(x, y, hasHitEndOnce, hasReturnedToStart, dist) {
  return `${x},${y},${hasHitEndOnce},${hasReturnedToStart},${dist}`;
}

function moveBlizzard(blizzard, grid) {
  let [blizzardX, blizzardY, dir] = blizzard;

  if (dir === OBJECTS.UP) {
    if (blizzardY === 1) blizzardY = grid.length - 1;
    return [blizzardX, blizzardY - 1, dir];
  }
  if (dir === OBJECTS.RIGHT) {
    if (blizzardX === grid[blizzardY].length - 2) blizzardX = 0;
    return [blizzardX + 1, blizzardY, dir];
  }
  if (dir === OBJECTS.DOWN) {
    if (blizzardY === grid.length - 2) blizzardY = 0;
    return [blizzardX, blizzardY + 1, dir];
  }
  if (dir === OBJECTS.LEFT) {
    if (blizzardX === 1) blizzardX = grid[blizzardY].length - 1;
    return [blizzardX - 1, blizzardY, dir];
  }
}

// precompute blizzard trajectories
function genereateBlizzardsByTime(grid, initialBlizzards) {
  let blizzards = initialBlizzards;
  let blizzardCache = {};
  let originalMap = {};

  for (let [x,y] of initialBlizzards) originalMap[`${x},${y}`] = true;
  let blizzardsByTime = [originalMap];

  blizzardCache[initialBlizzards.join('/')] = true;

  while (true) {
    blizzards = blizzards.map(blizzard => moveBlizzard(blizzard, grid));
    let blizzardMap = {};
    for (let [x,y] of blizzards) blizzardMap[`${x},${y}`] = true;

    let key = blizzards.join('/');
    if (blizzardCache[key] !== undefined) return blizzardsByTime;
    else blizzardsByTime.push(blizzardMap);
  }
}

function partOne(inputs, testMode) {
  let [grid, blizzardsByTime, startX, goalX, goalY] = parseGrid(inputs);

  let frontier = [[startX, 0, 0]];
  let bestDist = +Infinity;
  let cache = {};

  while (frontier.length > 0) {
    let [x, y, dist] = frontier.shift();

    // if there's no way this path is better than the best, end early
    if (dist >= bestDist) continue;

    // if we've already visited this spot, end early
    let key = hashState(x, y, false, false, dist);
    if (cache[key] !== undefined) continue;
    cache[key] = true;

    if (x === goalX && y === goalY) {
      bestDist = Math.min(dist - 1, bestDist);
      continue;
    }

    // try to stay still & move in every direction
    if (blizzardsByTime[dist % blizzardsByTime.length][`${x},${y}`] !== true) frontier.push([x, y, dist + 1]);
    for (let [deltaX, deltaY] of _.ORTHOGONAL_ADJ) {
      if (blizzardsByTime[dist % blizzardsByTime.length][`${x + deltaX},${y + deltaY}`] !== true && 
          _.safeGet2D(grid, x + deltaX, y + deltaY, OBJECTS.WALL) === OBJECTS.EMPTY) {
        frontier.push([x + deltaX, y + deltaY, dist + 1]);
      }
    }
  }

  return bestDist;
}

function partTwo(inputs, testMode) {
  let [grid, blizzardsByTime, startX, goalX, goalY] = parseGrid(inputs);

  let frontier = [[startX, 0, 0, false, false]];
  let bestDist = +Infinity;
  let cache = {};

  while (frontier.length > 0) {
    let [x, y, dist, hasHitEndOnce, hasReturnedToStart] = frontier.shift();

    // if there's no way this path is better than the best, end early
    if (dist >= bestDist) continue;

    // if we've already visited this spot, end early
    let key = hashState(x, y, hasHitEndOnce, hasReturnedToStart, dist);
    if (cache[key] !== undefined) continue;
    cache[key] = true;

    if (x === goalX && y === goalY && hasHitEndOnce && hasReturnedToStart) {
      bestDist = Math.min(dist - 1, bestDist);
      continue;
    }

    // account for the 3-part goal
    if (x === goalX && y === goalY && !hasHitEndOnce) hasHitEndOnce = true;
    if (x === startX && y === 0 && hasHitEndOnce && !hasReturnedToStart) hasReturnedToStart = true;

    // try to stay still & move in every direction
    if (blizzardsByTime[dist % blizzardsByTime.length][`${x},${y}`] !== true) frontier.push([x, y, dist + 1, hasHitEndOnce, hasReturnedToStart]);
    for (let [deltaX, deltaY] of _.ORTHOGONAL_ADJ) {
      if (blizzardsByTime[dist % blizzardsByTime.length][`${x + deltaX},${y + deltaY}`] !== true && 
          _.safeGet2D(grid, x + deltaX, y + deltaY, OBJECTS.WALL) === OBJECTS.EMPTY) {
        frontier.push([x + deltaX, y + deltaY, dist + 1, hasHitEndOnce, hasReturnedToStart]);
      }
    }
  }

  return bestDist;
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };