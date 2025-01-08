const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.',
  WALL: '#',
  START: 'S',
  END: 'E'
};

// generate a grid where every empty is the distance from S
function generateDistanceGrid(inputs) {
  let grid = inputs.map(row => row.split(''));

  let [startX, startY] = _.find2D(grid, OBJECTS.START);

  let [endX, endY] = _.find2D(grid, OBJECTS.END);
  grid[endY][endX] = OBJECTS.EMPTY;

  let frontier = [[startX, startY, 0]];

  while (frontier.length > 0) {
    let [x, y, dist] = frontier.pop();
    let key = `${x},${y}`;

    if (grid[y][x] !== OBJECTS.EMPTY && grid[y][x] <= dist) continue;
    grid[y][x] = dist;

    if (x === endX && y === endY) continue;

    for (let [dx, dy] of _.ORTHOGONAL_ADJ) {
      if (_.safeGet2D(grid, x + dx, y + dy) === OBJECTS.EMPTY) frontier.push([x + dx, y + dy, dist + 1]);
    }
  }

  return grid;
}

function partOne(inputs, testMode) {
  let grid = generateDistanceGrid(inputs);

  let numCheats = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OBJECTS.WALL) continue;
      let val = grid[y][x];

      // try to cheat to the other side of wall, saving the distance between end & start
      for (let [dx, dy] of _.ORTHOGONAL_ADJ) {
        let adjacent = _.safeGet2D(grid, x + dx, y + dy, undefined);
        let otherSide = _.safeGet2D(grid, x + (2 * dx), y + (2 * dy), OBJECTS.WALL);
        if (adjacent === OBJECTS.WALL && otherSide !== OBJECTS.WALL && (otherSide - val > 100)) numCheats++;
      }
    }
  }

  return numCheats;
}

function partTwo(inputs, testMode) {
  let grid = generateDistanceGrid(inputs);

  let numCheats = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === OBJECTS.WALL) continue;

      // try to cheat to all locations 20 distance away
      for (let dy = y - 20; dy <= y + 20; dy++) {
        for (let dx = x - 20; dx <= x + 20; dx++) {
          if (_.safeGet2D(grid, dx, dy, OBJECTS.WALL) === OBJECTS.WALL) continue;

          let dist = Math.abs(dy - y) + Math.abs(dx - x);
          if (dist > 20) continue;

          let cheat = (grid[dy][dx] - grid[y][x]) - dist;
          if (cheat >= 100) numCheats++;
        }
      }
    }
  }

  return numCheats;
}

module.exports = { partOne, partTwo };