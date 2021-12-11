const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const ADJ = _.ADJ;

// Increment an octopus by 1, and flash nearby octopi recursively upon reaching 10
function incrementOctopus(octopi, x, y) {
  if (_.safeGet2D(octopi, x, y) === undefined) return;

  octopi[y][x] = octopi[y][x] + 1;
  if (octopi[y][x] !== 10) return; // Don't flash multiple again after already hitting 10

  ADJ.forEach(([deltaX, deltaY]) => incrementOctopus(octopi, x + deltaX, y + deltaY));
}

let incrementAllOctopi = (octopi) => octopi.forEach((row, y) => row.forEach((val, x) => incrementOctopus(octopi, x, y)));
let countFlashes = (octopi) => _.sum(octopi.map(row => row.filter(val => val > 9).length));
let resetEnergyLevels = (octopi) => octopi.map(row => row.map(val => val > 9 ? 0 : val));

function partOne(inputs, numSteps = 100) {
  let octopi = inputs.map(input => input.split('').map(Number));
  let numFlashes = 0;
  
  for (let t = 1; t <= numSteps; t++) {
    incrementAllOctopi(octopi);
    numFlashes += countFlashes(octopi);
    octopi = resetEnergyLevels(octopi);
  }

  return numFlashes;
}

function partTwo(inputs, maxSteps = 1000) {
  let octopi = inputs.map(input => input.split('').map(Number));

  for (let t = 1; t <= maxSteps; t++) {
    incrementAllOctopi(octopi);

    if (countFlashes(octopi) === octopi.length * octopi[0].length) return t;

    octopi = resetEnergyLevels(octopi);
  }

  return undefined;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };