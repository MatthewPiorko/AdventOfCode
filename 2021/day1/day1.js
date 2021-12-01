const fs = require("fs");
const path = require("path");

function partOne(input) {
  let numIncreased = 0;
  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) numIncreased++;
  }
  return numIncreased;
}

function partTwo(input) {
  let numIncreased = 0;
  for (let i = 3; i < input.length; i++) {
    if (input[i] + input[i - 1] + input[i - 2] > input[i - 1] + input[i - 2] + input[i - 3]) numIncreased++;
  }
  return numIncreased;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/).map(Number);
  console.log(input);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };