const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function getHundredsDigit(num) {
  let str = String(num);
  return str[str.length - 3] || 0;
}

function determinePowerLevel(x, y, serialNumber) {
  let rackId = x + 10;
  let powerLevel = rackId * y;
  powerLevel += serialNumber;
  powerLevel *= rackId;
  powerLevel = getHundredsDigit(powerLevel);
  powerLevel -= 5;

  return powerLevel;
}

function buildSumTable(serialNumber) {
  let grid = _.arr2D(301, 301, 0);
  let sumTable = _.arr2D(301, 301, 0);

  _.range(1, 300).forEach(x =>
    _.range(1, 300).forEach(y =>
      grid[y][x] = determinePowerLevel(x, y, serialNumber)));

  _.range(1, 300).forEach(y =>
    _.range(1, 300).forEach(x =>
      sumTable[y][x] = _.safeGet2D(grid, x - 1, y - 1, 0) + _.safeGet2D(sumTable, x - 1, y, 0) + _.safeGet2D(sumTable, x, y - 1, 0) - _.safeGet2D(sumTable, x - 1, y - 1, 0)));

  return sumTable;
}

function determineLocalPower(sumTable, x, y, size = 3) {
  return sumTable[y + size][x + size] - sumTable[y][x + size] - sumTable[y + size][x] + sumTable[y][x];
}

function partOne(inputs) {
  let serialNumber = Number(inputs[0]);
  let sumTable = buildSumTable(serialNumber);

  let bestPower = -Infinity;
  let bestSpot = undefined;

  _.range(1, 297).forEach(x =>
    _.range(1, 297).forEach(y => {
      let localPower = determineLocalPower(sumTable, x, y);
      if (localPower > bestPower) {
        bestPower = localPower;
        bestSpot = `${x},${y}`;
      }
  }));

  return bestSpot;
}

function partTwo(inputs) {
  let serialNumber = Number(inputs[0]);
  let sumTable = buildSumTable(serialNumber);

  let bestPower = -Infinity;
  let bestSpot = undefined;

  _.range(1, 299).forEach(size => { 
    _.range(1, 300 - size).forEach(x =>
      _.range(1, 300 - size).forEach(y => {
        let localPower = determineLocalPower(sumTable, x, y, size);
        if (localPower > bestPower) {
          bestPower = localPower;
          bestSpot = `${x},${y},${size}`;
        }
    })); });

  return bestSpot;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };