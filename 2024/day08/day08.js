const _ = require('../../util/utils.js');

const OBJECTS = {
  EMPTY: '.'
};

function parseGrid(inputs) {
  let grid = inputs.map(row => row.split(''));
  let antenna = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let obj = grid[y][x];
      if (obj !== OBJECTS.EMPTY) {
        let knownAntenna = antenna[obj] || [];
        knownAntenna.push([x, y]);
        antenna[obj] = knownAntenna;
      }
    }
  }

  // 2D grid, dictionary of antenna symbol -> antenna [x, y]'s
  return [grid, antenna];
}

function inBounds(grid, x, y) {
  return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length;
}

function partOne(inputs, testMode) {
  let [grid, antenna] = parseGrid(inputs);

  let antinodes = new Set();
  for (let obj of Object.keys(antenna)) {
    let locations = antenna[obj];
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        let [x1, y1] = locations[i];
        let [x2, y2] = locations[j];

        // position opposite x1, y1
        let [node1x, node1y] = [x1 - (x2 - x1), y1 - (y2 - y1)];
        if (inBounds(grid, node1x, node1y)) antinodes.add(`${node1x},${node1y}`);

        // position opposite x2, y2
        let [node2x, node2y] = [x2 + (x2 - x1), y2 + (y2 - y1)];
        if (inBounds(grid, node2x, node2y)) antinodes.add(`${node2x},${node2y}`);
        
      }
    }
  }

  return antinodes.size;
}

function partTwo(inputs, testMode) {
  let [grid, antenna] = parseGrid(inputs);

  let antinodes = new Set();
  for (let obj of Object.keys(antenna)) {
    let locations = antenna[obj];
    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        let [x1, y1] = locations[i];
        let [x2, y2] = locations[j];

        // move away from the first location
        let [curx, cury] = [x1, y1];
        let [dx, dy] = [x2 - x1, y2 - y1];
        while (inBounds(grid, curx, cury)) {
          antinodes.add(`${curx},${cury}`);
          curx -= dx, cury -= dy;
        }

        // move away from the second location
        [curx, cury] = [x1, y1];
        while (inBounds(grid, curx, cury)) {
          antinodes.add(`${curx},${cury}`);
          curx += dx, cury += dy;
        }
      }
    }
  }

  return antinodes.size;
}

module.exports = { partOne, partTwo };