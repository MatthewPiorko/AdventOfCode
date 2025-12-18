const _ = require('../../util/utils.js');

let partOne = (inputs, testMode) => maxJoltage(inputs, 2);
let partTwo = (inputs, testMode) => maxJoltage(inputs, 12);

let maxJoltage = (inputs, numBatteries) => _.sum(inputs.map(input => 
  remainingMaxJoltage(input.split('').map(Number), numBatteries)));

// core logic is that any 12-length string is greater than any 11-length string
// and that anything starting with a 9 is higher than anything starting with an 8

// so, find the highest digit that can still make a 12-length string
// then find the highest digit in the remaining bank that can still make an 11-length string
// etc...

function remainingMaxJoltage(bank, numBatteriesLeft) {
  let firstDigit = _.max(bank.slice(0, bank.length - numBatteriesLeft + 1));

  if (numBatteriesLeft === 1) return firstDigit;

  for (let i = 0; i < bank.length; i++) {
    if (bank[i] === firstDigit) {
      let subMax = remainingMaxJoltage(bank.slice(i + 1), numBatteriesLeft - 1);
      return Number(firstDigit.toString() + subMax.toString());
    }
  }
}

module.exports = { partOne, partTwo };