const fs = require("fs");
const path = require("path");

const FFT = [0, 1, 0, -1];
const NUM_ITER = 100;

// Determines the FFT value at the given index in a repeat-long run
function determinePattern(repeats, index) {
  let i = Math.floor((index + 1) / repeats) % 4;
  return FFT[i];
}

function applyFFT(number, numIter) {
  for (let count = 0; count < numIter; count++) {
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

  return number;
}

const ANSWER_LEN = 8;

function partOne(number) {
  number = applyFFT(number, NUM_ITER);
  return number.slice(0, ANSWER_LEN).join('');
}

let cache = {};

function binomi(n, k) {
  let entry = `${n},${k}`;

  let coeff = 1n;
  for (let x = n - k + 1; x <= n; x++) coeff = (coeff * BigInt(x));
  for (x = 1; x <= k; x++) coeff = coeff / BigInt(x);

  cache[entry] = coeff;

  return coeff;
}

// Compute the FFT at a given index with a given number of iterations
// The idea is that if idx > number.length / 2,
//    then it will just be adding up all the numbers in order using the binomial coefficient
function computeFFTAt(number, idx, numIter) {
  console.log(`Computing FFT of ${idx} in ${number.length} length`);
  let arr = new Array(number.length).fill(0);
  arr[idx] = 1;

  let answer = 0n;

  for (let i = idx; i < number.length; i++) {
    let binomial = binomi(i - idx + numIter - 1, numIter - 1);
    answer = (answer + (BigInt(number[i]) * binomial)) % 10n;
  }

  return Number(answer);
}

const NUM_REPEATS = 10000;

function partTwo(number) {
  number = number.join('').repeat(NUM_REPEATS).split('').map(Number);

  let slicePoint = Number(number.slice(0, 7).join(''));

  let answer = [];
  for (let i = 0; i < 8; i++) {
    let next = computeFFTAt(number, slicePoint + i, 100);
    console.log(next);
    answer.push(next);
  }
  return answer.join('');

  number = applyFFT(number, 1);

  return number.slice(slicePoint, slicePoint + ANSWER_LEN).join('');
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  input = input[0].split("").map(Number);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };