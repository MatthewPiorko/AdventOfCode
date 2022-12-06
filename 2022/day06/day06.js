const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function allSame(chars) {
  return chars.some(char1 => _.sum(chars.map(char2 => char1 === char2 ? 1 : 0)) >= 2);
}

function movingWindowCheck(inputs, n) {
  let input = inputs[0].split("");
  return input.findIndex((val, idx) => idx >= n && !allSame(input.slice(idx - n, idx)));
}

let partOne = (inputs) => movingWindowCheck(inputs, 4);
let partTwo = (inputs) => movingWindowCheck(inputs, 14);

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };