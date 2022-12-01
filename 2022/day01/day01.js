const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// convert a single elf (list of strings) to it's sum
function sumElf(strings) {
	return _.sum(strings.map(Number));
}

// convert a list of elves to a list of numbers
function sumElves(inputs) {
	return inputs.map(input => sumElf(input.split('\n')));
}

function partOne(inputs) {
	return _.max(sumElves(inputs));
}

function partTwo(inputs) {
  let sortedElves = sumElves(inputs).sort((a,b) => b - a);
  return _.sum(sortedElves.slice(0, 3));
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };