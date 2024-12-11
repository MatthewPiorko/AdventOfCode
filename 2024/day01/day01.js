const _ = require('../../util/utils.js');

function splitInput(inputs) {
  let firsts = [], seconds = [];
  inputs.forEach(input => {
    let [_, first, second] = input.match(/(\d+)\s+(\d+)/);
    firsts.push(Number(first));
    seconds.push(Number(second));
  });

  return [firsts, seconds];
}

function partOne(inputs, testMode) {
  let [firsts, seconds] = splitInput(inputs);
  firsts.sort((a,b) => a - b);
  seconds.sort((a,b) => a - b);

  let diff = 0;
  for (let i = 0; i < firsts.length; i++) {
    diff += Math.abs(firsts[i] - seconds[i]);
  }

  return diff;
}

function partTwo(inputs, testMode) {
  let [firsts, seconds] = splitInput(inputs);

  let similarity = 0;
  for (let i = 0; i < firsts.length; i++) {
    let first = firsts[i];
    let occurrences = seconds.filter(second => first === second).length;
    similarity += (first * occurrences);
  }

  return similarity;
}

module.exports = { partOne, partTwo };