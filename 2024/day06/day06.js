const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  BLOCKED: '#',
  GUARD: '^'
};

function findStart(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OBJECTS.GUARD) return [x, y];
    }
  }
}

function turn90Degrees(dx, dy) {
  if (dx === 0 && dy === -1) return [1, 0];
  else if (dx === 1 && dy === 0) return [0, 1];
  else if (dx === 0 && dy === 1) return [-1, 0];
  else return [0, -1];
}

function partOne(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));

  let [x, y] = findStart(grid);
  grid[y][x] = OBJECTS.EMPTY;
  let [dx, dy] = [0, -1]; // always start moving upwards

  let visited = new Set();

  while (true) {
    let visitedKey = `${x},${y}`;
    visited.add(visitedKey);

    let nextSpace = _.safeGet2D(grid, x + dx, y + dy);
    if (nextSpace === undefined) return visited.size;
    else if (nextSpace === OBJECTS.BLOCKED) [dx, dy] = turn90Degrees(dx, dy);
    else { x += dx; y += dy; }
  }

  return undefined;
}

function exitsMap(grid, x, y) {
  grid[y][x] = OBJECTS.EMPTY;
  let [dx, dy] = [0, -1]; // always start moving upwards

  let visited = new Set();

  while (true) {
    let visitedKey = `${x},${y},${dx},${dy}`;
    if (visited.has(visitedKey)) return false;
    visited.add(visitedKey);

    let nextSpace = _.safeGet2D(grid, x + dx, y + dy);
    if (nextSpace === undefined) return true;
    else if (nextSpace === OBJECTS.BLOCKED) [dx, dy] = turn90Degrees(dx, dy);
    else { x += dx; y += dy; }
  }
}

function partTwo(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));
  let [startX, startY] = findStart(grid);

  let numTrapped = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== OBJECTS.EMPTY) continue;

      let updatedGrid = grid.map(row => row.map(x => x));
      updatedGrid[y][x] = OBJECTS.BLOCKED;
      if (!exitsMap(updatedGrid, startX, startY)) numTrapped++;
    }
  }

  return numTrapped;
}

module.exports = { partOne, partTwo };