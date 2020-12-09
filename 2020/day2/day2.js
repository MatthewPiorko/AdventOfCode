const fs = require("fs");
const path = require("path");

function parseString(unparsedString) {
  let re = /(\d+)-(\d+) (\w+): (\w+)/;

  return unparsedString.match(re);
}

function isValid(unparsedString) {
  let parsedString = parseString(unparsedString)

  let minOccurences = parsedString[1];
  let maxOccurences = parsedString[2];
  let letter = parsedString[3];
  let password = parsedString[4];

  let occurences = (password.replace(new RegExp(`[^${letter}]`, 'g'), '')).length;

  if (occurences < minOccurences || occurences > maxOccurences) return false;

  return true;
}

function isValidSecondAlgorithm(unparsedString) {
  let parsedString = parseString(unparsedString);

  let firstPosition = parsedString[1];
  let secondPosition = parsedString[2];
  let letter = parsedString[3];
  let password = parsedString[4];

  let firstMatches = password.charAt(firstPosition - 1) == letter;
  let secondMatches = password.charAt(secondPosition - 1) == letter;

  if (firstMatches ^ secondMatches) return true;

  return false;
}

function main() {
  fs.readFile(path.resolve(__dirname, 'input.txt'), function (err, data) {
    let input = data.toString().split('\n').map(isValid);
    console.log(input.reduce((sum, num) => sum + num, 0));
    let secondInput = data.toString().split('\n').map(isValidSecondAlgorithm);
    console.log(secondInput.reduce((sum, num) => sum + num, 0));
  });
}

module.exports = { main };