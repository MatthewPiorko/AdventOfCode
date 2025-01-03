const _ = require('../../util/utils.js');

function isSolvable(target, values, current) {
  if (values.length === 0) return target === current;
  let val = values[0];

  return isSolvable(target, [...values.slice(1)], current + val) ||
         isSolvable(target, [...values.slice(1)], current * val);
}

function partOne(inputs, testMode) {
  return _.sum(inputs.map(row => row.split(': '))
                     .map(([target, values]) => [Number(target), values.split(' ').map(value => Number(value))])
                     .filter(([target, values]) => isSolvable(target, values, 0))
                     .map(([target, values]) => target));
}

function isSolvableWithConcat(target, values, current) {
  if (values.length === 0) return target === current;
  let val = values[0];

  return isSolvableWithConcat(target, [...values.slice(1)], current + val) ||
         isSolvableWithConcat(target, [...values.slice(1)], current * val) ||
         isSolvableWithConcat(target, [...values.slice(1)], Number(current.toString() + val.toString()));
}

function partTwo(inputs, testMode) {
  return _.sum(inputs.map(row => row.split(': '))
                     .map(([target, values]) => [Number(target), values.split(' ').map(value => Number(value))])
                     .filter(([target, values]) => isSolvableWithConcat(target, values, 0))
                     .map(([target, values]) => target));
}

module.exports = { partOne, partTwo };