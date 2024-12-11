const _ = require('../../util/utils.js');

function parseInput(inputs) {
  inputs = inputs.join('\n').split('\n\n');
  let rules = inputs[0].split('\n').map(row => row.split("|"));
  let updates = inputs[1].split('\n').map(row => row.split(","));

  let mustSucceed = {};
  for (let [predecessor, successor] of rules) {
    let predecessors = mustSucceed[successor] || new Set();
    predecessors.add(predecessor);
    mustSucceed[successor] = predecessors;
  }

  return [rules, updates, mustSucceed];
}

function isValidUpdate(update, mustSucceed) {
  for (let i = 0; i < update.length; i++) {
    let predecessor = update[i];
    for (let j = i + 1; j < update.length; j++) {
      let successor = update[j];
      let ineligibleSuccessors = mustSucceed[predecessor];
      if (ineligibleSuccessors !== undefined && ineligibleSuccessors.has(successor)) return false;
    }
  }

  return true;
}

function middleIndex(arr) {
  let middleIndex = Math.floor(arr.length / 2);
  return arr[middleIndex];
}

function partOne(inputs, testMode) {
  let [rules, updates, mustSucceed] = parseInput(inputs);

  return _.sum(updates.filter(update => isValidUpdate(update, mustSucceed))
                      .map(update => Number(middleIndex(update))));
}

function sortEntries(a, b, mustSucceed) {
  let ineligibleSuccessors = mustSucceed[a];
  
  // if b cannot go after a, it's in the wrong order and should be swapped
  if (ineligibleSuccessors !== undefined && ineligibleSuccessors.has(b)) return 1;
  else return -1;
}

function partTwo(inputs, testMode) {
  let [rules, updates, mustSucceed] = parseInput(inputs);

  return _.sum(updates.filter(update => !isValidUpdate(update, mustSucceed))
                      .map(update => update.toSorted((a, b) => sortEntries(a, b, mustSucceed)))
                      .map(update => Number(middleIndex(update))));
}

module.exports = { partOne, partTwo };