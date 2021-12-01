const fs = require("fs");
const path = require("path");

function partOne(input) {
  return input.reduce((acc, n) => acc + n, 0);
}

function partTwo(input) {
  let val = 0;
  let seen = new Set();
  let index = 0;

  while (true) {
    if (seen.has(val)) return val;
    seen.add(val);

    val += input[index];
    index = (index + 1) % input.length;
  }
  
  return undefined;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);
  input = input.map(Number);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };