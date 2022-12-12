const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function partOne(inputs) {
  return undefined;
}

function partTwo(inputs) {
  return undefined;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };