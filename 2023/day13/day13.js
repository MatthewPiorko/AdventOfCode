const _ = require('../../util/utils.js');

const OBJECTS = {
  ASH: '.',
  ROCK: '#'
};

function partOne(inputs, testMode) {
  let grids = inputs.join('\n').split('\n\n').map(grid => grid.split('\n').map(row => row.split("")));
  return _.sum(grids.map(grid => findReflection(grid, undefined)));
}

// for part two, optionally ignore an answer (if there are multiple to find)
function findReflection(grid, ignoreAnswer) {
  // check vertical reflections, which reflect the x-axis
  for (let refY = 0.5; refY < grid[0].length - 1; refY++) {
    let reflectX = (x, y) => _.safeGet2D(grid, 2 * refY - x, y);
    let ans = Math.floor(refY) + 1;
    if (doesReflect(grid, reflectX) && ignoreAnswer !== ans) return ans;
  }

  // check horizontal reflections, which reflect the y-axis
  for (let refX = 0.5; refX < grid.length - 1; refX++) {
    let reflectY = (x, y) => _.safeGet2D(grid, x, 2 * refX - y);
    let ans = (Math.floor(refX) + 1) * 100;
    if (doesReflect(grid, reflectY) && ignoreAnswer !== ans) return ans;
  }

  // if no reflections are found, return undefined
  return undefined;
}

function doesReflect(grid, reflectPoint) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let point = _.safeGet2D(grid, x, y);
      let reflected = reflectPoint(x, y);

      // if reflected point is off the board, ignore it
      if (point === undefined || reflected === undefined) continue;

      // if any reflected points don't line up, this isn't the reflection
      if (point !== reflected) return false;
    }
  }

  return true;
}

function partTwo(inputs, testMode) {
  let grids = inputs.join('\n').split('\n\n').map(grid => grid.split('\n').map(row => row.split("")));
  return _.sum(grids.map(fixSmudge));
}

function fixSmudge(grid) {
  let originalAnswer = findReflection(grid);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      grid[y][x] = wipeSmudge(grid[y][x]);

      let newAnswer = findReflection(grid, originalAnswer);
      if (newAnswer !== originalAnswer && newAnswer !== undefined) return newAnswer;

      // revert the swap for the next iteration
      grid[y][x] = wipeSmudge(grid[y][x]);
    }
  }
}

let wipeSmudge = obj => obj === OBJECTS.ASH ? OBJECTS.ROCK : OBJECTS.ASH;

module.exports = { partOne, partTwo };