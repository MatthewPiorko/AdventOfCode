const _ = require('../../util/utils.js');

function numSolutions(current, goal, towels, cache) {
  if (current === goal) return 1;
  if (cache[current]) return cache[current];

  let solutions = 0;

  for (let towel of towels) {
    let test = current + towel;
    if (!goal.startsWith(test)) continue;

    solutions += numSolutions(test, goal, towels, cache);
  }

  cache[current] = solutions;
  return solutions;
}

function partOne(inputs, testMode) {
  let towels = inputs[0].split(", ");

  let patterns = inputs.slice(2);
  return patterns.filter(pattern => numSolutions("", pattern, towels, {}) > 0).length;
}

function partTwo(inputs, testMode) {
  let towels = inputs[0].split(", ");

  let patterns = inputs.slice(2);
  return _.sum(patterns.map(pattern => numSolutions("", pattern, towels, {})));
}

module.exports = { partOne, partTwo };