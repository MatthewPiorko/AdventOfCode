const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const OBJECTS = {
  ROCK: '@',
  EMPTY: '.',
  PLACED_ROCK: '#'
};

const HORIZONTAL = [[OBJECTS.ROCK, OBJECTS.ROCK, OBJECTS.ROCK, OBJECTS.ROCK]];
const PLUS = [[OBJECTS.EMPTY, OBJECTS.ROCK, OBJECTS.EMPTY], [OBJECTS.ROCK, OBJECTS.ROCK, OBJECTS.ROCK], [OBJECTS.EMPTY, OBJECTS.ROCK, OBJECTS.EMPTY]];
const L = [[OBJECTS.EMPTY, OBJECTS.EMPTY, OBJECTS.ROCK], [OBJECTS.EMPTY, OBJECTS.EMPTY, OBJECTS.ROCK], [OBJECTS.ROCK, OBJECTS.ROCK, OBJECTS.ROCK]];
const VERTICAL = [[OBJECTS.ROCK], [OBJECTS.ROCK], [OBJECTS.ROCK], [OBJECTS.ROCK]];
const SQUARE = [[OBJECTS.ROCK, OBJECTS.ROCK], [OBJECTS.ROCK, OBJECTS.ROCK]];

const ROCKS = [HORIZONTAL, PLUS, L, VERTICAL, SQUARE];

function anythingInDirection(grid, rockX, rockY, rock, deltaX, deltaY) {
  for (let y = 0; y < rock.length; y++) {
    for (let x = 0; x < rock[y].length; x++) {
      if (rock[y][x] !== OBJECTS.ROCK) continue;

      if (_.safeGet2D(grid, rockX + x + deltaX, rockY + y + deltaY, OBJECTS.ROCK) !== OBJECTS.EMPTY) {
        return true;
      }
    }
  }

  return false;
}

function getHighestRock(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== OBJECTS.EMPTY) return y; 
    }
  }

  return 0;
}

function simulateFallingRocks(inputs, numIter, cycleDetection) {
  let grid = _.arr2D(7, 0, OBJECTS.EMPTY);
  let jets = inputs[0];
  let rockI = 0, jetI = 0;

  let seen = {};
  let mostRecentN = [];
  let heightDuringCycles = 0;

  for (let iter = 0; iter < numIter; iter++) {
    let rock = ROCKS[rockI++ % ROCKS.length];
    let rockX = 2, rockY = 0;

    // ensure that there are exactly three empty rows at the top
    let highestRockDistance = getHighestRock(grid) - rock.length;
    if (highestRockDistance < 3) {
      grid = _.arr2D(7, 3 - highestRockDistance, OBJECTS.EMPTY).concat(grid);
    }
    if (highestRockDistance > 3) {
      grid = grid.slice(highestRockDistance - 3);
    }

    // drop a rock into the grid
    while (true) {
      let jet = jets[jetI++ % jets.length];
      if (jet === '>' && !anythingInDirection(grid, rockX, rockY, rock, +1, 0)) rockX++;
      if (jet === '<' && !anythingInDirection(grid, rockX, rockY, rock, -1, 0)) rockX--;

      if (anythingInDirection(grid, rockX, rockY, rock, 0, +1)) break;
      else rockY++;
    }

    // place rock into landing position
    for (let y = 0; y < rock.length; y++) {
      for (let x = 0; x < rock[y].length; x++) {
        if (rock[y][x] === OBJECTS.ROCK) grid[rockY + y][rockX + x] = OBJECTS.PLACED_ROCK;
      }
    }

    // look for a repeated set of rock placements that have already happened, and skip ahead    
    if (!cycleDetection) continue;

    // cycle length is arbitrary, as long as it's not too short to detect false cycles
    if (mostRecentN.length < 10) {
      mostRecentN.push([rockX, rockY]);
      continue;
    } else {
      mostRecentN = [...mostRecentN.slice(1), [rockX, rockY]];
    }

    let curHeight = grid.length - getHighestRock(grid);
    if (seen[mostRecentN] !== undefined) { // detected a cycle
      let [cycleStart, cycleStartHeight] = seen[mostRecentN];
      let cycleLength = iter - cycleStart;

      let numCyclesToRun = Math.floor((numIter - iter) / cycleLength);
      heightDuringCycles = numCyclesToRun * (curHeight - cycleStartHeight);
      iter += (numCyclesToRun * cycleLength); // simulate a bunch of loops of adding that set of height

      cycleDetection = false;
    } else { // stash this state to detect later
      seen[mostRecentN] = [iter, curHeight];
    }
  }

  let highestRock = getHighestRock(grid); // ignore the empty rows at the top
  return grid.length - highestRock + heightDuringCycles;
}

function partOne(inputs, testMode) {
  return simulateFallingRocks(inputs, 2022, false);
}

function partTwo(inputs, testMode) {
  return simulateFallingRocks(inputs, 1000000000000, true);
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };