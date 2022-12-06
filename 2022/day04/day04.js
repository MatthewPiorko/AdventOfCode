const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function parseSection(section) {
  let [x, y] = section.split('-');
  return [Number(x), Number(y)];
}

function isFullyContained(input) {
  let [sectionA, sectionB] = input.split(",");
  let [startA, endA] = parseSection(sectionA);
  let [startB, endB] = parseSection(sectionB);

  if (startA >= startB && endA <= endB) return true;
  if (startB >= startA && endB <= endA) return true;

  return false;
}

function partOne(inputs) {
  return inputs.filter(input => isFullyContained(input)).length;
}

function isPartiallyContained(input) {
  let [sectionA, sectionB] = input.split(",");
  let [startA, endA] = parseSection(sectionA);
  let [startB, endB] = parseSection(sectionB);
  
  let sections = _.range(0, Math.max(endA, endB), 1, false);
  for (let x = startA; x <= endA; x++) sections[x] = true;

  for (let x = startB; x <= endB; x++) {
    if (sections[x] === true) return true;
  }

  return false;
}

function partTwo(inputs) {
  return inputs.filter(input => isPartiallyContained(input)).length;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };