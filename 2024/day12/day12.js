const _ = require('../../util/utils.js');

// handles cases where plant A is planted in two different regions
function removeDuplicatePlants(input) {
  let originalGrid = input.map(row => row.split(''));
  let plantId = 0;
  let grid = _.arr2D(originalGrid[0].length, originalGrid.length);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== undefined) continue;

      floodFill(originalGrid, grid, x, y, originalGrid[y][x], plantId);
      plantId++;
    }
  }

  return grid;
}

function floodFill(originalGrid, grid, startX, startY, oldChar, newChar) {
  let frontier = [[startX, startY]];
  let visited = new Set();

  while (frontier.length > 0) {
    let [x,y] = frontier.pop();
    let key = `${x},${y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (_.safeGet2D(originalGrid, x, y) !== oldChar) continue;
    grid[y][x] = newChar;

    for (let [dx, dy] of _.ORTHOGONAL_ADJ) {
      frontier.push([x + dx, y + dy]);
    }
  }

  return;
}

function partOne(inputs, testMode) {
  let grid = removeDuplicatePlants(inputs);

  let perimeters = {};
  let areas = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let current = grid[y][x];

      areas[current] = (areas[current] || 0) + 1;

      for (let [dx, dy] of _.ORTHOGONAL_ADJ) {
        if (_.safeGet2D(grid, x + dx, y + dy) !== current) {
          perimeters[current] = (perimeters[current] || 0) + 1;
        }
      }
    }
  }

  let totalCost = 0;
  for (let region of Object.keys(perimeters)) {
    totalCost += (perimeters[region] * areas[region]);
  }

  return totalCost;
}

function partTwo(inputs, testMode) {
  let grid = removeDuplicatePlants(inputs);

  let numSides = {};
  let areas = {};
  let alreadyCounted = new Set();

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let current = grid[y][x];

      areas[current] = (areas[current] || 0) + 1;

      for (let [dx, dy] of _.ORTHOGONAL_ADJ) {
        if (_.safeGet2D(grid, x + dx, y + dy) !== current) {
          let originalKey = `${current},${x},${y},${dx},${dy}`;
          if (alreadyCounted.has(originalKey)) continue;

          numSides[current] = (numSides[current] || 0) + 1;

          // mark all edges along the perpendicular as already counted
          let sideLen = 1, newDx, newDy;
          // positive perpendicular
          if (dx === 0) {
            newDx = 1;
            newDy = 0;
          } else {
            newDx = 0;
            newDy = 1;
          }

          while (true) {
            let newY = y + (sideLen * newDy);
            let newX = x + (sideLen * newDx);

            let alreadyCountedKey = `${current},${newX},${newY},${dx},${dy}`;
            if (alreadyCounted.has(alreadyCountedKey)) break;

            if (_.safeGet2D(grid, newX, newY) === current &&
                _.safeGet2D(grid, newX + dx, newY + dy) !== current) {
              sideLen++;
              alreadyCounted.add(alreadyCountedKey);
            } else {
              break;
            }
          }

          // negative perpendicular
          sideLen = 1;
          newDx *= -1;
          newDy *= -1;
          while (true) {
            let newY = y + (sideLen * newDy);
            let newX = x + (sideLen * newDx);

            let alreadyCountedKey = `${current},${newX},${newY},${dx},${dy}`;
            if (alreadyCounted.has(alreadyCountedKey)) break;

            if (_.safeGet2D(grid, newX, newY) === current &&
                _.safeGet2D(grid, newX + dx, newY + dy) !== current) {
              sideLen++;
              alreadyCounted.add(alreadyCountedKey);
            } else {
              break;
            }
          }
        }
      }
    }
  }

  let totalCost = 0;
  for (let region of Object.keys(numSides)) {
    totalCost += (numSides[region] * areas[region]);
  }

  return totalCost;
}

module.exports = { partOne, partTwo };