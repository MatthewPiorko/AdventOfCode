const fs = require("fs");
const path = require("path");

const FFT = [0, 1, 0, -1];
const NUM_ITER = 100;

// Determines the FFT value at the given index in a repeat-long run
function determinePattern(repeats, index) {
  let i = Math.floor((index + 1) / repeats) % 4;
  return FFT[i];
}

function partOne(number) {
  for (let count = 0; count < NUM_ITER; count++) {
    let nextNumber = [];

    for (let iter = 1; iter <= number.length; iter++) {
      let nextValue = 0;

      for (let i = 0; i < number.length; i++) {
        nextValue += number[i] * determinePattern(iter, i);
      }

      let next = Math.abs(nextValue > 0 ? nextValue % 10 : (nextValue * -1) % 10);
      nextNumber.push(next);
    }

    number = nextNumber;
  }
  return number.slice(0, 8).join('');
}

function partTwo(number) {
  number = number.join('').repeat(100).split('').map(Number);

  return partOne(number);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  input = input[0].split("").map(Number);

  // console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };