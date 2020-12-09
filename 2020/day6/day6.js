const fs = require("fs");
const path = require("path");

function countUniqueChars(combinedAnswers) {
  let charDictionary = {};
  for (char of combinedAnswers) charDictionary[char] = 1;

  return Object.keys(charDictionary).length;
}

// Count the unique characters appearing in every comma-separated answer
function countUniqueCharsInEveryAnswer(separatedAnswers) {
  let answers = separatedAnswers.split(',');
  let combinedUniqueAnswers = {};

  // Make a dictionary of the unique characters for each answer
  answers.forEach(answer => {
    let individualUniqueAnswers = {};
    for (char of answer) individualUniqueAnswers[char] = 1;

    Object.keys(individualUniqueAnswers).forEach(key => 
      combinedUniqueAnswers[key] = (combinedUniqueAnswers[key] || 0) + 1);
  });

  // If there are n occurences of a character across n answers, every answer includes it
  return Object.keys(combinedUniqueAnswers).map(key => combinedUniqueAnswers[key] == answers.length)
    .reduce((acc, val) => acc + val);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(str => str.trim());
  let uniqueChars = input.map(countUniqueChars).reduce((acc, val) => acc + val);

  console.log(uniqueChars);

  input = fs.readFileSync(path.resolve(__dirname, 'input2.txt')).toString().split('\n').map(str => str.trim());
  let uniqueCommonChars = input.map(countUniqueCharsInEveryAnswer).reduce((acc, val) => acc + val);

  console.log(uniqueCommonChars);
}

module.exports = { main };