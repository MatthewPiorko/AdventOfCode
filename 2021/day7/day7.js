const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

let triangularNumber = n => n * (n + 1) / 2;

function findMinDistance(nums, distanceFunc) {
  let distances = _.range(0, _.max(nums)).map(start => _.sum(nums.map(num => distanceFunc(num, start))));
  return _.min(distances);
}

function partOne(inputs) {
  return findMinDistance(inputs, (num, start) => Math.abs(num - start));
}

function partTwo(inputs) {
 return findMinDistance(inputs, (num, start) => triangularNumber(Math.abs(num - start)));
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);
  inputs = inputs[0].split(',').map(Number);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };