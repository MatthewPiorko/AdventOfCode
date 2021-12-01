const fs = require("fs");
const path = require("path");

class Claim {
  constructor(id, x, y, width, height) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

const STATE = {
  EMPTY: '.',
  OCCUPIED: '#',
  OVERLAP: '1'
}

function parseInput(line) {
  let [, id, x, y, width, height] = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
  return new Claim(Number(id), Number(x), Number(y), Number(width), Number(height));
}

function findMaxDistance(claims) {
  let maxX = 0, maxY = 0;

  for (let claim of claims) {
    if (claim.x + claim.width > maxX) maxX = claim.x + claim.width;
    if (claim.y + claim.height > maxY) maxY = claim.y + claim.height;
  }

  return [maxX + 2, maxY + 2];
}

function printFabric(fabric) {
  for (let row of fabric) {
    let s = "";
    for (let piece of row) {
      s += piece;
    }
    console.log(s);
  }
}

function buildFabric(claims) {
  let [maxX, maxY] = findMaxDistance(claims);
  let fabric = [];

  fabric = new Array(maxY).fill(0).map(row => new Array(maxX).fill(STATE.EMPTY));

  for (let claim of claims) {
    for (let x = claim.x; x < claim.x + claim.width; x++) {
      for (let y = claim.y; y < claim.y + claim.height; y++) {
        let current = fabric[y][x];
        if (current === STATE.OCCUPIED) fabric[y][x] = STATE.OVERLAP;
        else if (current === STATE.EMPTY) fabric[y][x] = STATE.OCCUPIED;
      }
    }
  }

  return fabric;
}

function partOne(input) {
  let claims = input.map(parseInput);
  let fabric = buildFabric(claims);

  return fabric.reduce((rowAcc, row) => rowAcc + 
    row.reduce((acc, piece) => acc + (piece === STATE.OVERLAP ? 1 : 0), 0), 0);
}

// Determines if every spot claimed does not overlap with any other claim
function isClaimNonOverlapping(fabric, claim) {
  for (let x = claim.x; x < claim.x + claim.width; x++) {
    for (let y = claim.y; y < claim.y + claim.height; y++) {
      if (fabric[y][x] !== STATE.OCCUPIED) return false;
    }
  }

  return true;
}

function partTwo(input) {
  let claims = input.map(parseInput);
  let fabric = buildFabric(claims);

  for (let claim of claims) {
    if (isClaimNonOverlapping(fabric, claim)) return claim.id;
  }
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };