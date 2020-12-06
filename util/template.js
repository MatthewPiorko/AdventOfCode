var fs = require("fs");

function compute(input) {
  return false;
}

function computePartTwo(input) {
  return false;
}

let input = fs.readFileSync('input.txt').toString().split('\n').map(s => s.trim());

console.log(compute(input));
console.log(computePartTwo(input));