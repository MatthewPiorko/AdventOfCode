const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  return _.sum(inputs.map(str => getCalibrationValue(str, false)));
}

function partTwo(inputs, testMode) {
  return _.sum(inputs.map(str => getCalibrationValue(str, true)));
}

function getCalibrationValue(str, allowSpelling) {
  return getFirstDigit(str, allowSpelling, DIGIT_STRINGS) * 10 
       + getFirstDigit(reverse(str), allowSpelling, DIGIT_STRINGS_REVERSE);
}

function reverse(str) {
  return str.split("").reverse().join("");
}

const DIGIT_STRINGS = [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ]
const DIGIT_STRINGS_REVERSE = [ "eno", "owt", "eerht", "ruof", "evif", "xis", "neves", "thgie", "enin" ]

function getFirstDigit(str, allowSpelling, digitStrings) {
  for (let i = 0; i < str.length; i++) {
    if (!isNaN(str[i])) return Number(str[i]);

    if (!allowSpelling) continue;

    for (let digitIdx = 0; digitIdx < digitStrings.length; digitIdx++) {
      let toCheck = digitStrings[digitIdx];
      if (str.substring(i, i + toCheck.length) == toCheck) return digitIdx + 1;
    }
  }
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };