const fs = require("fs");
const path = require("path");

function shuffle(input, numCards) {
  let cards = new Array(numCards).fill(0).map((_, idx) => idx);

  for (let line of input) {
    line = line.split(' ');

    if (line[0] === "cut") {
      let val = Number(line[line.length - 1]);
      if (val < 0) val = numCards - (-1 * val);

      cards = cards.slice(val).concat(cards.slice(0, val));
    } else if (line[1] === "with") {
      let val = Number(line[line.length - 1]);

      let newCards = new Array(numCards).fill(0);

      let idx = 0;
      for (let i = 0; i < numCards; i++) {
        newCards[idx] = cards[i];
        idx = (idx + val) % numCards;
      }
      cards = newCards;
    } else if (line[1] === "into") {
      cards = cards.reverse();
    } else {
      return undefined;
    }
  }

  return cards;
}

const INVERSES = {
  9: 53029207784021,
  49: 26785161074582,

}

class Euclidean {
  constructor(n, b, q, r, t1, t2, t3) {
    this.n = n;
    this.b = b;
    this.q = q;
    this.r = r;
    this.t1 = t1;
    this.t2 = t2;
    this.t3 = t3;
  }
}

let cache = {};

// Finds the multiplicative inverse of n mod numCards using the extended euclidean algorithm
// taken from https://www.extendedeuclideanalgorithm.com/multiplicative_inverse.php
function findMultiplicativeInverse(n, numCards) {
  let entry = `${n},${numCards}`;
  if (cache[entry] !== undefined) return cache[entry];

  let quotient = Math.floor(numCards / n);
  let euclidean = new Euclidean(numCards, n, quotient, numCards % n, 0, 1, -1 * quotient);

  while (euclidean.b !== 1) {
    quotient = Math.floor(euclidean.b / euclidean.r)
    euclidean = new Euclidean(euclidean.b, euclidean.r, quotient, euclidean.b % euclidean.r, euclidean.t2, euclidean.t3, euclidean.t2 - (quotient * euclidean.t3));
  }

  let inverse = (euclidean.t2 + numCards) % numCards;
  cache[entry] = inverse;
  return inverse;
}

// Compute the original position of the desired card by applying each function in reverse
function reverseEngineer(input, desiredCard, numCards, numShuffles) {
  let position = desiredCard;
  let seenPos = {};

  for (let i = 0; i < numShuffles; i++) {
    if (position === 29018970587825 && (numShuffles - i > 220705)) {
      console.log(`Seen 29018970587825 at iteration ${i}`);
      let numSkips = Math.floor((numShuffles - i) / 220705);
      i = i + (numSkips * 220705) - 1;
      console.log(`Skipping to iteration ${i}`);
      continue;
    }

    // if (seenPos[position] !== undefined) {
    //   console.log(`Seen ${position} after ${i - seenPos[position]} (from iteration ${seenPos[position]} again after ${i} iterations!`);
    // }

    for (line of input) {
      line = line.split(' ');

      if (line[0] === "cut") {
        let val = Number(line[line.length - 1]);
        if (val > 0) {
          val = numCards - val;
          if (position < val) {
            position = ((position - val) + numCards) % numCards;
          } else {
            position = (position + (numCards - val)) % numCards;
          }
        } else {
          val = -1 * val;
          if (position > val) {
            position = (position + (numCards - val)) % numCards;
          } else {
            position = ((position - val) + numCards) % numCards;
          }
        }
      } else if (line[1] === "with") {
        let val = Number(line[line.length - 1]);
        let inverse = findMultiplicativeInverse(val, numCards);
        position = (position * inverse) % numCards;
      } else if (line[1] === "into") {
        position = numCards - position - 1;
      } else {
        return undefined;
      }
    }
  }

  return position;
}

const PART_ONE_CARDS = 10007;
const PART_ONE_DESIRED_CARD = 2019;

function partOne(input) {
  let cards = shuffle(input, PART_ONE_CARDS);

  for (let i = 0; i < cards.length; i++) {
    if (cards[i] === PART_ONE_DESIRED_CARD) return i;
  }
}

const PART_TWO_CARDS = 119315717514047;
const PART_TWO_SHUFFLES = 101741582076661;
const PART_TWO_DESIRED_CARD = 2020;

function partTwo(input) {
  // First card repeat is 29018970587825, repeat cycle is 220705
  input.reverse();
  return reverseEngineer(input, 2020, PART_TWO_CARDS, PART_TWO_SHUFFLES);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  // console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };