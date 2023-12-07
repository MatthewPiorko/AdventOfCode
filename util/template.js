const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  return undefined;
}

function partTwo(inputs, testMode) {
  return undefined;
}

function main(file, testMode, runPartOne, runPartTwo) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  if (runPartOne) {
    let partOneStart = performance.now();
    console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);
  }

  if (runPartTwo) {
    let partTwoStart = performance.now()
    console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
  }
}

module.exports = { main };