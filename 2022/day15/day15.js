const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function parseInputs(inputs) {
  return inputs.map(input => {
    let [didMatch, x, y, closestX, closestY] = input.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
    return [Number(x), Number(y), Number(closestX), Number(closestY)];
  });
}

// returns [is (distressX, distressY) covered by any beacon, the next X to test if this is covered]
function isCovered(distressX, distressY, inputs) {
  for (let [x, y, closestX, closestY] of inputs) { 
    let coverage = Math.abs(x - closestX) + Math.abs(closestY - y); //radius at y
    coverage -= Math.abs(distressY - y); //radius at distressY

    if (distressX >= (x - coverage) && distressX <= (x + coverage)) {
      return [true, x + coverage]; //skip to [x + coverage], since all spots between [x - coverage, x + coverage] will be covered
    }
  }

  return [false, undefined];
}

function partOne(inputs, testMode) {
  let desiredY = testMode ? 10 : 2000000;
  inputs = parseInputs(inputs);
  let minX = _.min(inputs.map(signal => signal[0]));
  let maxX = _.max(inputs.map(signal => signal[2]));

  let numCovered = 0;
  let extraBorder = maxX - minX; // additionally search to the left and right, since beacons' range can extend off the initial grid

  for (let x = minX - extraBorder; x <= maxX + extraBorder; x++) {
    let [covered, nextX] = isCovered(x, desiredY, inputs);
    
    if (covered) {
      numCovered += (nextX - x) + 1;
      x = nextX;
    }
  }

  return numCovered - 1;
}

function partTwo(inputs, testMode) {
  inputs = parseInputs(inputs);

  for (let y = 0; y < (testMode ? 20 : 4000000); y++) {
    for (let x = 0; x < (testMode ? 20 : 4000000); x++) {
      let [covered, nextX] = isCovered(x, y, inputs);
      
      if (!covered) return (4000000 * x + y);
      else x = nextX;
    }
  }

  return undefined;
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };