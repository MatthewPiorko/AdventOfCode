const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// Returns an object with a count of each starting element pair
function parsePolymer(inputs) {
  return _.range(0, inputs.length - 2)
    .map(idx => inputs[idx] + inputs[idx + 1])
    .reduce((polymer, elementPair) => { polymer[elementPair] = (polymer[elementPair] || 0) + 1; return polymer }, {});
}

// Returns an object mapping an element pair to the two post-insertion element pairs
function parseRules(inputs) {
  return inputs.reduce((rules, input) => {
    let [group, sourcePair, inserted] = input.match(/(\w{2}) -> (\w)/);
    rules[sourcePair] = [sourcePair[0] + inserted, inserted + sourcePair[1]];
    return rules;
  }, {});
}

// Replace every element pair with both of it's derived element pairs
function runIteration(polymer, rules) {
  return Object.keys(polymer).reduce((newPolymer, elementPair) => {
    rules[elementPair].forEach(newElementPair => newPolymer[newElementPair] = (newPolymer[newElementPair] || 0) + polymer[elementPair]);
    return newPolymer;
  }, {});
}

function countElements(polymer) {
  return Object.entries(polymer).reduce((elementCounts, [elementPair, count]) => {
    elementPair.split('').forEach(element => elementCounts[element] = (elementCounts[element] || 0) + count);
    return elementCounts;
  }, {});
}

function runPairInsertions(inputs, iterations) {
  let polymer = parsePolymer(inputs[0]);
  let rules = parseRules(inputs.slice(2));

  for (let i = 0; i < iterations; i++) {
    polymer = runIteration(polymer, rules);
  }

  let elementCounts = countElements(polymer);
  let mostCommonCount = _.max(Object.values(elementCounts));
  let leastCommonCount = _.min(Object.values(elementCounts));

  // Every element is double-counted, except for the very first and very last element, which are only single counted
  // Always round the single counts up
  return Math.ceil(mostCommonCount / 2) - Math.ceil(leastCommonCount / 2); 
}

function partOne(inputs) {
  return runPairInsertions(inputs, 10);
}

function partTwo(inputs) {
  return runPairInsertions(inputs, 40);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };