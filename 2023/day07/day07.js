const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const TYPES = {
  HIGH: 1,
  PAIR: 2,
  TWO_PAIR: 3,
  THREE_KIND: 4,
  FULL_HOUSE: 5,
  FOUR_KIND: 6,
  FIVE_KIND: 7
};

class Hand {
  constructor(input, hasJokers) {
    let [_, str, bid] = input.match(/(.*) (\d+)/);
    this.str = str;
    this.bid = Number(bid);

    let grouped = {}, numJokers = 0;
    for (let char of str.split("")) {
      if (char === 'J' && hasJokers) numJokers++;
      else grouped[char] = (grouped[char] || 0) + 1;
    }

    // map the input to the match amount + number of times it happens
    // e.g. JJQQQ => { "2": 1, "3": 1 } since it has a pair and a triple
    let matches = {};
    for (let count of Object.values(grouped)) {
      matches[count] = (matches[count] || 0) + 1;
    }

    this.type = !hasJokers ?
      calculateHandType(matches) :
      calculateJokerHandType(matches, numJokers);
  }
}

function calculateHandType(matches) {
  if (matches[5]) return TYPES.FIVE_KIND;
  else if (matches[3] && matches[2]) return TYPES.FULL_HOUSE;
  else if (matches[4]) return TYPES.FOUR_KIND;
  else if (matches[3]) return TYPES.THREE_KIND;
  else if (matches[2] > 1) return TYPES.TWO_PAIR;
  else if (matches[2]) return TYPES.PAIR;
  else return TYPES.HIGH;
}

function calculateJokerHandType(matches, numJokers) {
  if (matches[5]) return TYPES.FIVE_KIND;
  if (matches[3] && matches[2]) return TYPES.FULL_HOUSE;

  if (matches[4] && numJokers === 1) return TYPES.FIVE_KIND;
  else if (matches[4]) return TYPES.FOUR_KIND;

  if (matches[3] && numJokers === 2) return TYPES.FIVE_KIND;
  else if (matches[3] && numJokers === 1) return TYPES.FOUR_KIND;
  else if (matches[3]) return TYPES.THREE_KIND;

  if (matches[2] > 1 && numJokers === 1) return TYPES.FULL_HOUSE;
  else if (matches[2] > 1) return TYPES.TWO_PAIR;

  if (matches[2] && numJokers === 3) return TYPES.FIVE_KIND;
  else if (matches[2] && numJokers === 2) return TYPES.FOUR_KIND;
  else if (matches[2] && numJokers === 1) return TYPES.THREE_KIND;
  else if (matches[2]) return TYPES.PAIR;

  if (numJokers === 5 || numJokers === 4) return TYPES.FIVE_KIND;
  else if (numJokers === 3) return TYPES.FOUR_KIND;
  else if (numJokers === 2) return TYPES.THREE_KIND;
  else if (numJokers === 1) return TYPES.PAIR;
  else if (numJokers === 0) return TYPES.HIGH;
}

const CARD_VALUES = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14
}

const JOKER_CARD_VALUES = Object.assign({}, CARD_VALUES);
JOKER_CARD_VALUES['J'] = 0;

function compareHands(hand1, hand2, cardValues) {
  if (hand1.type != hand2.type) return hand1.type - hand2.type;

  let i = 0;
  while (hand1.str[i] === hand2.str[i]) i++;

  return cardValues[hand1.str[i]] - cardValues[hand2.str[i]];
}

let partOne = (inputs, testMode) => calculateWinnings(inputs, false);
let partTwo = (inputs, testMode) => calculateWinnings(inputs, true);

function calculateWinnings(inputs, hasJokers) {
  return _.sum(inputs.map(input => new Hand(input, hasJokers))
                     .sort((a,b) => compareHands(a, b, hasJokers ? JOKER_CARD_VALUES : CARD_VALUES))
                     .map((hand, i) => (i + 1) * hand.bid));
}

function main(file, testMode, runPartOne, runPartTwo) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  if (runPartOne) {
    let partOneStart = performance.now();
    console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);
  }

  if (runPartTwo) {
    let partTwoStart = performance.now()
    console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
  }
}

module.exports = { main };