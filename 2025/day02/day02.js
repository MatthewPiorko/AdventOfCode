const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  let ranges = inputs[0].split(',');
  let sumInvalid = 0;

  for (let range of ranges) {
    let [match, start, end] = range.match(/(\d+)-(\d+)/);
    start = Number(start), end = Number(end);

    for (let i = start; i <= end; i++) {
      if (!isValidPartOne(i)) sumInvalid += i;
    }
  }

  return sumInvalid;
}

function isValidPartOne(id) {
  id = id.toString();
  if (id.length % 2 === 1) return true;

  return id.substring(0, id.length / 2) !== id.substring(id.length / 2);
}

function partTwo(inputs, testMode) {
  let ranges = inputs[0].split(',');
  let sumInvalid = 0;

  for (let range of ranges) {
    let [match, start, end] = range.match(/(\d+)-(\d+)/);
    start = Number(start), end = Number(end);

    for (let i = start; i <= end; i++) {
      if (!isValidPartTwo(i)) sumInvalid += i;
    }
  }

  return sumInvalid;
}

function isValidPartTwo(id) {
  id = id.toString();

  for (let length = 1; length <= id.length / 2; length++) {
    if (id.length % length !== 0) continue;

    let start = id.substring(0, length);
    let numRepeats = id.length / length;
    let startRepeated = start.repeat(numRepeats);

    if (id === startRepeated) return false;
  }

  return true;
}

module.exports = { partOne, partTwo };