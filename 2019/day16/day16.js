const fs = require("fs");
const path = require("path");

const FFT = [0, 1, 0, -1];

function createPattern(repeats, length) {
  let pattern = [];

  while (pattern.length <= length) {
    for (val of FFT) {
      pattern = pattern.concat(new Array(repeats).fill(val));
    }
  }

  return pattern.slice(1, length + 1);
}

function partOne(input) {
  let number = input[0].split("").map(Number);

  for (let count = 0; count < 100; count++) {
    let nextNumber = [];

    for (let iter = 1; iter <= number.length; iter++) {
      let pattern = createPattern(iter, number.length);
      let nextValue = 0;

      for (let i = 0; i < number.length; i++) {
        nextValue += number[i] * pattern[i];
      }

      let str = String(nextValue);
      nextNumber.push(Number(str[str.length - 1]));
    }

    number = nextNumber;
  }


  console.log(number.slice(0, 8).join(""));

  return false;
}

function partTwo(input) {
  return false;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };