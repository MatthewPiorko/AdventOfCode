const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function snafuToDecimal(input) {
  input = input.split('');

  let num = 0;
  for (let i = input.length - 1; i >= 0; i--) {
    let digit;

    if (input[i] === "-") digit = -1;
    else if (input[i] === "=") digit = -2;
    else digit = Number(input[i]);

    num += ((5 ** (input.length - 1 - i)) * digit);
  }

  return num;
}

const DECIMAL_TO_SNAFU_REMAINDER = {
  3: '=',
  4: '-',
  5: '0'
};

function decimalToSnafu(num) {
  let ans = [];

  while (num > 0) {
    ans.unshift(num % 5);
    num = Math.floor(num / 5);
  }

  for (let i = ans.length - 1; i >= 0; i--) {
    // since digits greater than 2 cannot be represented in SNAFU,
    // turn them into negatives with the next carry digit incremented
    let mappedDigit = DECIMAL_TO_SNAFU_REMAINDER[ans[i]];
    if (mappedDigit !== undefined) {
      ans[i] = mappedDigit;
      ans[i - 1]++;
    }
  }

  return ans.join('');
}

function partOne(inputs, testMode) {
  let total = _.sum(inputs.map(snafuToDecimal));
  return decimalToSnafu(total);
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);
}

module.exports = { main };