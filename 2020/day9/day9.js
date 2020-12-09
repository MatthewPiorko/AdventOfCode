const fs = require("fs");
const path = require("path");
const { findPairSum } = require('../day1/day1.js');

const PREAMBLE_LENGTH = 25;

function findEntryWithoutPairSum(input) {
  let index = PREAMBLE_LENGTH;
  let integers;

  while (index <= input.length) {
    let integers = input.slice(index - PREAMBLE_LENGTH, index);

    if (findPairSum(integers, input[index]) == -1) return input[index];

    index++;
  }
}

// Find the consecutive list (of any length) of numbers that sum to the expected value
function findContinuousSeriesThatSumsTo(input, expectedSum) {
  let index = 2;
  let length = 2;

  while (length < input.length) {
    while (index < input.length) {
      let integers = input.slice(index - length, index);
      let sum = integers.reduce((acc, val) => acc + val);

      if (sum == expectedSum) {
        return integers;
      }

      index++;
    }

    length++;
    index = length;
  }
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(Number);
  let invalidNumber = findEntryWithoutPairSum(input);
  console.log(`Part one answer: ${invalidNumber}`);

  let continuousIntegers = findContinuousSeriesThatSumsTo(input, invalidNumber);
  let largest = continuousIntegers.reduce((acc, val) => Math.max(acc, val), 0);
  let smallest = continuousIntegers.reduce((acc, val) => Math.min(acc, val), Infinity)
  console.log(`Part two answer: ${largest + smallest}`);
}

module.exports = { main };