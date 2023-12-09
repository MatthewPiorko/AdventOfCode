const _ = require('../../util/utils.js');

let partOne = (inputs, testMode) => _.sum(inputs.map(calculateNext));
let partTwo = (inputs, testMode) => _.sum(inputs.map(calculatePrevious));

function calculateNext(input) {
  let diffs = calculateDiffs(input);

  for (let n = diffs.length - 2; n >= 0; n--) {
    diffs[n].push(diffs[n].at(-1) + diffs[n + 1].at(-1));
  }

  return diffs[0].at(-1);
}

function calculatePrevious(input) {
  let diffs = calculateDiffs(input);

  for (let n = diffs.length - 2; n >= 0; n--) {
    diffs[n].unshift(diffs[n][0] - diffs[n + 1][0]);
  }

  return diffs[0][0];
}

function calculateDiffs(input) {
  input = input.split(" ").map(Number);
  let diffs = [input], prev = input;

  while (true) {
    let next = _.range(0, prev.length - 2).map(i => prev[i + 1] - prev[i]);
    diffs.push(next);

    if (next.every(x => x === 0)) return diffs;
    prev = next;
  }
}

module.exports = { partOne, partTwo };