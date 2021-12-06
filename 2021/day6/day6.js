const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function ageFish(startingAges, numDays) {
  // Keep track of the number of fish at each day in their cycle (fish are 0-8 days old)
  let numPerDay = _.range(0, 9).map(day => startingAges.filter(age => age === day).length);

  for (let i = 0; i < numDays; i++) {
    let newNumPerDay = _.range(0, 9).map(day => numPerDay[day + 1]); // Move every fish forward one day
    newNumPerDay[8] = numPerDay[0]; // Every fish ending it's cycle births a new fish which starts at 8 days
    newNumPerDay[6] += numPerDay[0]; // Every fish ending it's cycle resets to 6 days
    numPerDay = newNumPerDay;
  }

  return _.sum(numPerDay);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);
  let startingAges = inputs[0].split(',').map(Number);

  console.log(`Part one answer: ${ageFish(startingAges, 80)}`);
  console.log(`Part two answer: ${ageFish(startingAges, 256)}`);
}

module.exports = { main };