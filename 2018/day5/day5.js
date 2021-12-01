const fs = require("fs");
const path = require("path");

function react(polymer) {
  let newPolymer = [];

  for (let i = 0; i < polymer.length; i++) {
    if (i === polymer.length - 1) {
      newPolymer.push(polymer[i]);
      continue;
    }

    if (polymer[i].toUpperCase() === polymer[i + 1].toUpperCase() && polymer[i] !== polymer[i + 1]) {
      i += 1;
      continue;
    } else {
      newPolymer.push(polymer[i]);
    }
  }

  return newPolymer;
}

function reactUntilDone(polymer) {
  let i = 0;
  while (true) {
    let newPolymer = react(polymer);

    if (newPolymer.length === polymer.length) {
      console.log(`Reaction took ${i} iterations`);
      return polymer.length;
    }

    polymer = newPolymer;
    i++;
  }

  return undefined;
}

function partOne(input) {
  return reactUntilDone(input);
}

function partTwo(input) {
  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  let bestLength = +Infinity;
  for (let char of alphabet) {

    let newPolymer = input.slice().filter(c => c !== char && c !== char.toUpperCase());
    let length = reactUntilDone(newPolymer);

    if (length < bestLength) bestLength = length;
  }

  return bestLength;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);
  input = input[0].split("");

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };