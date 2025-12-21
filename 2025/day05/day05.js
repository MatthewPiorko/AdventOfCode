const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  let [ranges, ingredients] = parseInput(inputs);

  return ingredients.filter(ingredient => isFresh(ingredient, ranges)).length;
}

function parseInput(inputs) {
  let [ranges, ingredients] = inputs.join('\n').split('\n\n');

  ranges = ranges.split('\n').map(range => {
    let [match, start, end] = range.match(/(\d+)-(\d+)/);
    return [Number(start), Number(end)];
  });
  ingredients = ingredients.split('\n').map(Number);

  return [ranges, ingredients];
}

function isFresh(ingredient, ranges) {
  for (let [start, end] of ranges) {
    if (ingredient >= start && ingredient <= end) return true;
  }

  return false;
}

// reduce the ranges to be distinct sub-ranges, then total their size
function partTwo(inputs, testMode) {
  let [ranges, ingredients] = parseInput(inputs);

  let uniquePoints = new Set();
  for (let [start, end] of ranges) {
    uniquePoints.add(start);
    uniquePoints.add(end);
  }

  let orderedPoints = Array.from(uniquePoints);
  orderedPoints.sort((a,b) => a - b);

  let totalInside = 0;
  for (let i = 0; i < orderedPoints.length - 1; i++) {
    let p1 = orderedPoints[i], p2 = orderedPoints[i + 1];
    if (isCoveredByAnyRange(p1, p2, ranges)) {
      // don't include the ends of the range, just the inside
      totalInside += (p2 - p1) - 1;
    }
  }

  return totalInside + uniquePoints.size;
}

function isCoveredByAnyRange(p1, p2, ranges) {
  for (let [start, end] of ranges) {
    if (p1 >= start && p2 <= end) return true;
  }

  return false;
}

module.exports = { partOne, partTwo };