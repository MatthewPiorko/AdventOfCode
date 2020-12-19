const fs = require("fs");
const path = require("path");

const DERIVATION_TYPES = {
  CONST: 0,
  SINGLE: 1,
  SINGLE_OR: 2,
  DOUBLE: 3,
  DOUBLE_OR: 4
}

class Rule {
  constructor(id, type, derivations) {
    this.id = id;
    this.type = type;
    this.derivations = derivations;
  }
}

function parseRule(ruleString) {
  let [_, num, values] = ruleString.match(/(\d+): (.*)/);
  num = Number(num);
  values = values.replace(/\"/g, "");

  if (values.match(/^[ab]$/)) {
    return new Rule(num, DERIVATION_TYPES.CONST, values.match(/(.)/)[1]);
  }

  if (values.match(/^\d+$/)) {
    return new Rule(num, DERIVATION_TYPES.SINGLE, values.match(/(\d+)/)[1]);
  }

  if (values.match(/^\d+ \| \d+$/)) {
    let [_, first, second] = values.match(/(\d+) \| (\d+)/);

    return new Rule(num, DERIVATION_TYPES.SINGLE_OR, [first, second]);
  }

  if (values.match(/^\d+ \d+$/)) {
    let [_, first, second] = values.match(/(\d+) (\d+)/);

    return new Rule(num, DERIVATION_TYPES.DOUBLE, [first, second]);
  }

  if (values.match(/^\d+ \d+ \| \d+ \d+$/)) {
    let [_, num1, num2, num3, num4] = values.match(/(\d+) (\d+) \| (\d+) (\d+)/);

    return new Rule(num, DERIVATION_TYPES.DOUBLE_OR, [[num1, num2], [num3, num4]]);
  }
}

// From a given rule, determine all possible strings that could be derived
function getAllDerivations(rules, ruleId, cache) {
  if (cache[ruleId] != undefined) return cache[ruleId];

  let rule = rules[ruleId];
  let derivations = new Set();

  switch (rule.type) {
    case DERIVATION_TYPES.CONST:
      derivations.add(rule.derivations);
      break;
    case DERIVATION_TYPES.SINGLE:
      derivations = getAllDerivations(rules, rule.derivations, cache);
      break;
    case DERIVATION_TYPES.SINGLE_OR:
      for (derivation of getAllDerivations(rules, rule.derivations[0], cache)) derivations.add(derivation);
      for (derivation of getAllDerivations(rules, rule.derivations[1], cache)) derivations.add(derivation);
      
      break;
    case DERIVATION_TYPES.DOUBLE:
      let firstDerivations = getAllDerivations(rules, rule.derivations[0], cache);
      let secondDerivations = getAllDerivations(rules, rule.derivations[1], cache);

      for (first of firstDerivations) {
        for (second of secondDerivations) {
          derivations.add(first + second);
        }
      }

      break;
    case DERIVATION_TYPES.DOUBLE_OR:
      let leftFirstDerivation = getAllDerivations(rules, rule.derivations[0][0], cache);
      let leftSecondDerivations = getAllDerivations(rules, rule.derivations[0][1], cache);

      for (first of leftFirstDerivation) {
        for (second of leftSecondDerivations) {
          derivations.add(first + second);
        }
      }

      let rightFirstDerivation = getAllDerivations(rules, rule.derivations[1][0], cache);
      let rightSecondDerivations = getAllDerivations(rules, rule.derivations[1][1], cache);

      for (first of rightFirstDerivation) {
        for (second of rightSecondDerivations) {
          derivations.add(first + second);
        }
      }
      break;
  }

  cache[ruleId] = derivations;

  return derivations;
}

function findMessagesMatchingRules(input) {
  let rulesIndex = input.findIndex(line => line == "");

  let rules = input.slice(0, rulesIndex).map(parseRule)
    .reduce((ruleObj, rule) => { ruleObj[rule.id] = rule; return ruleObj; }, {});
  let messages = input.slice(rulesIndex + 1);
  
  let cache = {};
  let derivations = getAllDerivations(rules, 0, cache);

  let numMatches = messages.reduce((acc, message) => acc + derivations.has(message), 0);

  return [numMatches, cache, messages];
}

// Split a message into chunks of 8 characters each
function splitMessage(message) {
  let result = [];

  for (let i = 0; i < message.length; i += 8) {
    result.push(message.substring(i, i + 8));
  }

  return result;
}

// Determine if a pattern matches [42, 42, ..., 42, 31, 31, ..., 31]
// where the pattern ends with an equal number of 42's and 31's and has at least one 42 at the start
// Parameters are bit masks of the groups of characters determining whether that block fits the pattern
function matchesPattern(matches42, matches31) {
  let firstNon42 = matches42.indexOf(false);

  if (firstNon42 <= matches42.length / 2) return false;

  if (!matches31.slice(firstNon42).every(m => m)) return false;

  return true;
}

// For the new rules, it isn't necesary to calculate all derivations anymore.
// The 42 rule and 31 rule divide the string into 8-bit blocks, and if those blocks
// follow a pattern, they can be formed.
function findMessagesMatchingExpandedRules(messages, cache) {
  let numMatches = 0;

  for (message of messages) {
    let groups = splitMessage(message);

    let matches42 = groups.map(m => cache[42].has(m));
    let matches31 = groups.map(m => cache[31].has(m));

    if (matchesPattern(matches42, matches31)) numMatches++;
  }

  return numMatches;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  let [numMatches, cache, messages] = findMessagesMatchingRules(input);

  console.log(`Part one answer: ${numMatches}`);
  console.log(`Part two answer: ${findMessagesMatchingExpandedRules(messages, cache)}`);
}

module.exports = { main };