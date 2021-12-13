const fs = require("fs");
const path = require("path");

function partOne(input) {
  return input.filter((val, idx) => val > input[idx - 1]).length;
}

function partTwo(input) {
  return input.filter((val, idx) => val > input[idx - 3]).length;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/).map(Number);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };