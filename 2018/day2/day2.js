const fs = require("fs");
const path = require("path");

function countLetters(word) {
  let count = {};

  for (let i = 0; i < word.length; i++) {
    count[word[i]] = (count[word[i]] || 0) + 1;
  }

  return count;
}

function partOne(input) {
  let numDoubles = 0, numTriples = 0;

  for (let i = 0; i < input.length; i++) {
    let word = input[i];
    let hasDouble = false, hasTriple = false;

    let count = countLetters(word);
    for (let letter of Object.keys(count)) {
      if (count[letter] === 2) hasDouble = true;
      if (count[letter] === 3) hasTriple = true;
    }

    if (hasDouble) numDoubles++;
    if (hasTriple) numTriples++;
  }
  return numDoubles * numTriples;
}

function isMatch(word1, word2) {
  let numDifferent = 0;

  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) numDifferent++;
  }

  return numDifferent === 1;
}

function matchingChars(word1, word2) {
  let matchingChars = "";

  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === word2[i]) matchingChars += word1[i];
  }  

  return matchingChars;
}

function partTwo(input) {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (isMatch(input[i], input[j])) return matchingChars(input[i], input[j]);
    }
  }
  return undefined;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };