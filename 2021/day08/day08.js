const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

let getInputs = input => input.split('|')[0].trim().split(' ');
let getOutputs = input => input.split('|')[1].trim().split(' ');

const SINGLE_OPTION_LENGTHS = [2,3,4,7];

function partOne(inputs) {
  return _.sum(inputs.map(input => getOutputs(input).filter(output => SINGLE_OPTION_LENGTHS.includes(output.length)).length));
}

const ALL_CHARS = ["a","b","c","d","e","f","g"];

const LETTER_STRING_TO_NUMBER = {
  "abcefg": 0,
  "cf": 1,
  "acdeg": 2,
  "acdfg": 3,
  "bcdf": 4,
  "abdfg": 5,
  "abdefg": 6,
  "acf": 7,
  "abcdefg": 8,
  "abcdfg": 9
};

// Return if the value is not mapped by any key in obj
let isUnmapped = (obj, value) => !Object.keys(obj).some(key => obj[key] === value);

// Convert a string like acbe to the number formed by using segments b, c, d, f
let convertStringToNum = (convert, string) => LETTER_STRING_TO_NUMBER[string.split('').map(c => convert[c]).sort().join('')];

function determineNumberShown(input) {
  let words = getInputs(input);
  let stringsByCount = {};
  for (let word of words) {
    if (stringsByCount[word.length] === undefined) stringsByCount[word.length] = [];
    stringsByCount[word.length].push(word.split(''));
  }

  let answer = {};

  // f is in the 1 and used 9 times in total
  answer["f"] = stringsByCount[2][0].filter(char => _.sum(words.map(word => word.includes(char) ? 1 : 0)) === 9)[0]; 
  // c is the other character in 1
  answer["c"] = stringsByCount[2][0].filter(char => isUnmapped(answer, char))[0];
  // a is the last remaining in 7
  answer["a"] = stringsByCount[3][0].filter(char => isUnmapped(answer, char))[0];
  // 2 is the 5-letter word with c but not f
  let number2 = stringsByCount[5].filter(word => word.includes(answer["c"]) && !word.includes(answer["f"]))[0];
  // b is the unused character in 2 that isn't f
  answer["b"] = ALL_CHARS.filter(char => !number2.includes(char) && answer["f"] !== char)[0];
  // 5 is the 5-letter word with f but not c
  let number5 = stringsByCount[5].filter(word => word.includes(answer["f"]) && !word.includes(answer["c"]))[0];
  // e is the unused character in 5 that isn't c
  answer["e"] = ALL_CHARS.filter(char => !number5.includes(char) && answer["c"] !== char)[0];
  // d is the last remaining in 4
  answer["d"] = stringsByCount[4][0].filter(char => isUnmapped(answer, char))[0];
  // g is the last remaining
  answer["g"] = ALL_CHARS.filter(char => isUnmapped(answer, char))[0];

  let reverseMap = Object.keys(answer).reduce((acc, key) => { acc[answer[key]] = key; return acc; }, {});
  return Number(getOutputs(input).map(output => convertStringToNum(reverseMap, output)).join(''));
}

function partTwo(inputs) {
  return _.sum(inputs.map(determineNumberShown));
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };