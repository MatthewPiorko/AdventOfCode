const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  inputs = inputs.join('\n').split('\n\n').map(input => input.split('\n'));
  let regions = inputs.at(-1);

  return regions.filter(isValidRegion).length;
}

function isValidRegion(region) {
  let [match, length, width, numPresents] = region.match(/(\d+)x(\d+): (.*)/);
  numPresents = numPresents.split(' ').map(Number);

  // none of the presents in the real input are tetris-able
  // so just check that you can place them all sequentially
  let sizeAvailable = length * width;
  let sizeRequired = _.sum(numPresents) * 9;

  return sizeAvailable >= sizeRequired;
}

function partTwo(inputs, testMode) {
  return undefined;
}

module.exports = { partOne, partTwo };