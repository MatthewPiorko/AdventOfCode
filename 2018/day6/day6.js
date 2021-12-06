const fs = require("fs");
const path = require("path");

function manhattenDistance(x, y, targetX, targetY) {
  return Math.abs(x - targetX) + Math.abs(y - targetY);
}

function determineClosestChar(x, y, coords) {
  let distances = coords.map(coord => {
    return manhattenDistance(x, y, coord[0], coord[1]);
  });

  let minDistance = distances.reduce((min, distance) => Math.min(min, distance), Infinity);

  let closestCoords = [];
  for (let i = 0; i < coords.length; i++) {
    if (distances[i] == minDistance) closestCoords.push(coords[i]);
  }

  if (closestCoords.length == 1) {
    return closestCoords[0][2];
  }

  return 0;
}

function parseCoords(input) {
  let name = "A";
  let coords = [];

  for (let str of input) {
    let comma = str.indexOf(',');
    let coord = [Number(str.slice(0, comma)), Number(str.slice(comma + 1)), name]
    coords.push(coord);

    name = String.fromCharCode(name.charCodeAt(0) + 1);
  }

  return coords;
}

function partOne(input) {
  let coords = parseCoords(input);

  let maxX = coords.reduce((max, coord) => Math.max(max, coord[0]), 0);
  let maxY = coords.reduce((max, coord) => Math.max(max, coord[0]), 0);

  let coordCounts = {};
  let infiniteCoords = new Set();

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      let char = determineClosestChar(x, y, coords);
      coordCounts[char] = (coordCounts[char] || 0) + 1;

      if (x === 0 || y === 0 || x === maxX || y === maxY) infiniteCoords.add(char);
    }
  }

  let validCoords = coords.map(coord => coord[2]).filter(coord => coord !== 0 && !infiniteCoords.has(coord));
  let bestCoord = validCoords.reduce((best, coord) => coordCounts[coord] > coordCounts[best] ? coord : best, validCoords[0]);

  return coordCounts[bestCoord];
}

function partTwo(input, maxDistance) {
  let coords = parseCoords(input);

  let maxX = coords.reduce((max, coord) => Math.max(max, coord[0]), 0);
  let maxY = coords.reduce((max, coord) => Math.max(max, coord[0]), 0);
  let numInRegion = 0;

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      let distance = coords.map(coord => manhattenDistance(x, y, coord[0], coord[1]))
        .reduce((totalDistance, distance) => totalDistance + distance, 0);

      if (distance < maxDistance) numInRegion++;
    }
  }

  return numInRegion;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input, 10000)}`);
}

module.exports = { main };