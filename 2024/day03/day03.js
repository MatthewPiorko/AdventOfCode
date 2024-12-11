const _ = require('../../util/utils.js');

function parseByCharacter(input) {
  let sum = 0;

  while (input.length > 0) {
    if (input.match(/^mul\(\d+,\d+\)/)) {
      let [fullMatch, a, b] = input.match(/^mul\((\d+),(\d+)\)/);
      sum += (Number(a) * Number(b));
      input = input.substring(fullMatch.length);
    } else {
      input = input.substring(1);
    }
  }

  return sum;
}

function partOne(inputs, testMode) {
  return parseByCharacter(inputs.join(""));
}

function parseByCharacterWithEnablement(input) {
  let sum = 0;
  let isActive = true;

  while (input.length > 0) {
    if (input.startsWith("don't")) {
      input = input.substring(5);
      isActive = false;
    } else if (input.startsWith("do")) {
      input = input.substring(2);
      isActive = true;
    } else if (input.match(/^mul\(\d+,\d+\)/)) {
      let [fullMatch, a, b] = input.match(/^mul\((\d+),(\d+)\)/);
      if (isActive) sum += (Number(a) * Number(b));
      input = input.substring(fullMatch.length);
    } else {
      input = input.substring(1);
    }
  }

  return sum;
}

function partTwo(inputs, testMode) {
  return parseByCharacterWithEnablement(inputs.join(""));
}

module.exports = { partOne, partTwo };