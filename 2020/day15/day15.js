const fs = require("fs");
const path = require("path");

function determineNumberSpokenAt(startingNumbers, maxSize) {
  let dict = new Array(maxSize);

  for (let idx = 0; idx < startingNumbers.length - 1; idx++) {
    dict[startingNumbers[idx]] = idx + 1;
  }

  let count = startingNumbers.length;
  let latest = startingNumbers.slice(-1)[0];

  while (count < maxSize) {
    let newNum = dict[latest] == undefined ? 0 : count - dict[latest];

    dict[latest] = count;
    latest = newNum;
    count++;
  }

  return latest;
}

const PART_ONE_INDEX = 2020;
const PART_TWO_INDEX = 30000000;

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let startingNumbers = input[0].split(',').map(Number);

  console.log(`Part one answer: ${determineNumberSpokenAt(startingNumbers, PART_ONE_INDEX)}`);
  console.log(`Part two answer: ${determineNumberSpokenAt(startingNumbers, PART_TWO_INDEX)}`);
}

module.exports = { main };