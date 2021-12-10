const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

let isOpeningChar = (char) => ["[", "{", "<", "("].filter(opener => opener === char).length > 0;

const PAIR = {
  "{": "}",
  "}": "{",
  "[": "]",
  "]": "[",
  "<": ">",
  ">": "<",
  "(": ")",
  ")": "("
};

const SYNTAX_COST = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137
}

// Find the [syntax error cost, remaining opens] after parsing the given str
function attemptSyntaxParse(str) {
  let opens = [];

  for (let char of str) {
    if (isOpeningChar(char)) opens.push(char);
    else if (opens.pop() !== PAIR[char]) return [SYNTAX_COST[char], opens];
  }

  return [undefined, opens];
}

function partOne(inputs) {
  return _.sum(inputs.map(input => attemptSyntaxParse(input)[0]).filter(val => val > 0));
}

const AUTOCOMPLETE_COST = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4
};

let getClosingCost = (opens) => opens.reverse().reduce((acc, open) => (acc * 5) + AUTOCOMPLETE_COST[PAIR[open]], 0);

function partTwo(inputs) {
  let costs = inputs.map(input => attemptSyntaxParse(input)).filter(opens => opens[0] === undefined).map(opens => getClosingCost(opens[1]));
  costs.sort((a,b) => a - b);

  return costs[Math.floor(costs.length / 2)];
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };