const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// Convert a number to modulo range [1, 2, ..., n]
function safeMod(num, n) {
  return (num + n - 1) % n + 1;
}

// Map a string A,B,C to numeric 1,2,3
function charToNum(char) {
  return char.charCodeAt(0) - 64;
}

function fight([elfChoiceStr, myChoiceStr]) {
  let myChoice = charToNum(myChoiceStr) - 23; // Also subtract from X,Y,Z -> A,B,C
  let mappedElfChoice = charToNum(elfChoiceStr);
  let fightScore = myChoice;

  // If numbers are the same, it's a draw; if their choice is the number after the mine, I win
  if (mappedElfChoice === myChoice) fightScore += 3;
  if (safeMod(mappedElfChoice + 1, 3) === safeMod(myChoice, 3)) fightScore += 6;

  return fightScore;
}

function partOne(inputs) {
  return _.sum(inputs.map(input => fight(input.split(' '))));
}

function riggedFight([elfChoiceStr, goalStr]) {
  let goal = charToNum(goalStr) - 23;
  let elfChoice = charToNum(elfChoiceStr);

  let resultScore = (goal - 1) * 3;
  let fightScore = 0;

  // To force a loss, use the previous letter. To force a win, use the next letter
  if (goalStr === 'Y') fightScore += elfChoice;
  if (goalStr === 'X') fightScore += safeMod(elfChoice - 1, 3);
  if (goalStr === 'Z') fightScore += safeMod(elfChoice + 1, 3);

  return resultScore + fightScore;
}

function partTwo(inputs) {
  return _.sum(inputs.map(input => riggedFight(input.split(' '))));
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };