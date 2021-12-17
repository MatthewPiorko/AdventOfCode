const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function parseTargetArea(input) {
  let [group, minX, maxX, minY, maxY] = input.match(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/);
  return [Number(minX), Number(maxX), Number(minY), Number(maxY)];
}

// Returns [landed in area, maximum height reached]
function landsInArea(x, y, minX, maxX, minY, maxY) {
  let currentX = 0, currentY = 0, velX = x, velY = y;
  let highest = 0;

  while (true) {
    currentX += velX;
    currentY += velY;
    highest = Math.max(currentY, highest);

    if (velX > 0) velX--;
    else if (velX < 0) velX++;
    velY--;

    if (currentX >= minX && currentX <= maxX && currentY >= minY && currentY <= maxY) {
      return [true, highest];
    }

    if (currentY < minY) return [false, highest];
  }
}

function partOne(inputs) {
  let [minX, maxX, minY, maxY] = parseTargetArea(inputs[0]);
  let maxAngle = Math.max(maxX, maxY); // Anything over this angle will overshoot in both directions immediately
  let highestReached = -Infinity;

  for (let x = 0; x < maxAngle + 1; x++) {
    for (let y = -maxAngle - 1; y < maxAngle + 1; y++) {
      let [landedInArea, maxReached] = landsInArea(x, y, minX, maxX, minY, maxY);
      if (landedInArea) highestReached = Math.max(highestReached, maxReached);
    }
  }

  return highestReached;
}

function partTwo(inputs) {
  let [minX, maxX, minY, maxY] = parseTargetArea(inputs[0]);
  let maxAngle = Math.max(maxX, maxY); // Anything over this angle will overshoot in both directions immediately
  let validAngles = new Set();

  for (let x = 0; x < maxAngle + 1; x++) {
    for (let y = -maxAngle - 1; y < maxAngle + 1; y++) {
      let [landedInArea, maxReached] = landsInArea(x, y, minX, maxX, minY, maxY);
      if (landedInArea) validAngles.add(`${x},${y}`);
    }
  }

  return validAngles.size;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };