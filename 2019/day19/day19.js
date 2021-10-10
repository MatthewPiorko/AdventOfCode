const fs = require("fs");
const path = require("path");

const { runInstructionsOnList } = require("../common/intcode-compiler");

const STATES = {
  STATIONARY: 0,
  PULLED: 1
}

let cache = {};

function runDrone(instrs, x, y) {
  let cacheEntry = `${x},${y}`;

  if (cache[cacheEntry] !== undefined) return cache[cacheEntry];

  instrs = instrs.map(String);
  let output = runInstructionsOnList(instrs, [x, y])[0];
  cache[cacheEntry] = output;
  return output;
}

function isSquare(instrs, x, y) {
  for (let deltaX = 0; deltaX < 100; deltaX++) {
    for (let deltaY = 0; deltaY < 100; deltaY++) {
      if (runDrone(instrs, x + deltaX, y + deltaY) !== STATES.PULLED) return false;
    }
  }

  return true;
}

function partOne(instrs, size) {
  let numAffected = 0;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y< size; y++) {
      if (runDrone(instrs, x, y) === STATES.PULLED) numAffected++;
    }
  }

  return numAffected;
}

// Finds an eligible starting position
function findStartingPoint(instrs, x, y) {
  // Setting startX to 2500, assuming that there will be a square there
  let startX = 2500, startY = startX - 500;

  while (!isSquare(instrs, startX, startY) && startY < startX * 2) {
    startY += 100;
  }

  return [startX, startY];
}

// Finds the top left corner of a square by iteratively moving up and left until there's no square
// Uses a delta distance to make large steps at first, then more refined
function findTopLeftCorner(instrs, x, y, delta) {
  if (isSquare(instrs, x - delta, y - delta)) return findTopLeftCorner(instrs, x - delta, y - delta, delta);
  if (isSquare(instrs, x - delta, y)) return findTopLeftCorner(instrs, x - delta, y, delta);
  if (isSquare(instrs, x, y - delta)) return findTopLeftCorner(instrs, x, y - delta, delta);

  if (delta === 1) return [x,y];

  return findTopLeftCorner(instrs, x, y, Math.floor(delta / 2));
}

function partTwo(instrs) {
  let [x, y] = findStartingPoint(instrs, 0, 0);
  [x, y] = findTopLeftCorner(instrs, x, y, 256);

  return x * 10000 + y;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${partOne(instrs, 50)}`);
  console.log(`Part two answer: ${partTwo(instrs)}`);
}

module.exports = { main };