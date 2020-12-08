var fs = require("fs");

function partOne(input) {
  return false;
}

function partTwo(input) {
  return false;
}

let input = fs.readFileSync('input.txt').toString().split('\n');

console.log(`Part one answer: ${partOne(input)}`);
console.log(`Part two answer: ${computePartTwo(input)}`);