const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function letterToValue(char) {
  let value = char.charCodeAt(0);
  return value < 97 ? value - 64 + 26 : value - 96;
}

function findCommons(str1, str2) {
  return str1.split("").filter(char => str2.indexOf(char) != -1);
}

function findCommon(input) {
  let middle = input.length / 2;
  let firstHalf = input.slice(0, middle);
  let secondHalf = input.slice(middle);

  return letterToValue(findCommons(firstHalf, secondHalf)[0]);
}

function partOne(inputs) {
  return _.sum(inputs.map(input => findCommon(input)));
}

function partTwo(inputs) {
  let score = 0;
  for (let i = 0; i < inputs.length; i += 3) {
    let group = inputs.slice(i, i + 3);

    let firstCommons = findCommons(group[0], group[1]);
    let allCommons = findCommons(firstCommons.join(''), group[2]);

    score += letterToValue(allCommons[0]);
  }

  return score;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };