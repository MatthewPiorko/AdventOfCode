const fs = require("fs");
const path = require("path");

function partOne(input) {
  return undefined;
}

function partTwo(input) {
  return undefined;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };