const _ = require('../../util/utils.js');

function isSafe(level) {
  let isAscending = (level[1] - level[0] > 0);

  for (let i = 1; i < level.length; i++) {
    let diff = level[i] - level[i - 1];

    if (diff > 0 && !isAscending) return false;
    if (diff < 0 && isAscending) return false;
    if (Math.abs(diff) > 3 || Math.abs(diff) < 1) return false;
  }

  return true;
}

function partOne(inputs, testMode) {
  inputs = inputs.map(row => row.split(" ").map(Number));
  return _.sum(inputs.map(level => isSafe(level) ? 1 : 0));
}

function isSafeWithTolerance(level) {
  if (isSafe(level)) return true;

  for (let i = 0; i < level.length; i++) {
    let removed = [...level.slice(0, i), ...level.slice(i + 1)];
    if (isSafe(removed)) return true;
  }

  return false;
}

function partTwo(inputs, testMode) {
  inputs = inputs.map(row => row.split(" ").map(Number));
  return _.sum(inputs.map(level => isSafeWithTolerance(level) ? 1 : 0));
}

module.exports = { partOne, partTwo };