const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// can do modulo on negative numbers, from https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function safeMod(n, mod) {
  return ((n % mod) + mod) % mod;
}

function runEncryption(inputs, numIterations) {
  let original = inputs.map((v, idx) => [Number(v), idx]); // keep around the original idx for easy searching later
  let current = original.map(x => x);

  for (let iter = 0; iter < numIterations; iter++) {
    for (let i = 0; i < original.length; i++) {
      let currentI = current.findIndex(([v, originalI]) => i === originalI);
      let newPos = safeMod(currentI + original[i][0], original.length - 1);

      let left = [];
      let right = [];

      if (newPos >= currentI) { // number is currently to the left of newPos
        left = current.slice(0, newPos + 1).filter(x => x[1] != original[i][1]);
        right = current.slice(newPos + 1);
      } else if (newPos < currentI) { // number is currently to the right of newPos
        left = current.slice(0, newPos);
        right = current.slice(newPos).filter(x => x[1] != original[i][1]);
      }

      current = [...left, original[i], ...right];
    }
  }

  let start = current.findIndex(([v, i]) => v === 0);
  return current[(start + 1000) % original.length][0] + current[(start + 2000) % original.length][0] + current[(start + 3000) % original.length][0];
}

function partOne(inputs, testMode) {
  return runEncryption(inputs, 1);
}

function partTwo(inputs, testMode) {
  return runEncryption(inputs.map(input => input * 811589153), 10);
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };