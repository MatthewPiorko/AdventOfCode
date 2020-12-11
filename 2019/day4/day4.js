const fs = require("fs");
const path = require("path");

function validateRepeatedDigit(password, allowExtraRepeats) {
  let index = 0;

  while (index < password.length) {
    let char = password[index];

    if (char != password[index + 1]) {
      index++;
      continue;
    }

    // If additional repeats are not allowed and there is a repeat, skip over this number group
    if (!allowExtraRepeats && char == password[index + 2]) {
      while (password[index] == char) index++;
      continue;
    }

    return true;
  }

  return false;
}

function validatePassword(password, allowExtraRepeats) {
  if (!validateRepeatedDigit(password, allowExtraRepeats)) return false;

  for (let index = 0; index < password.length; index++) {
    if (password[index] > password[index + 1]) return false;
  }

  return true;
}

function validatePasswordRange(min, max, allowExtraRepeats) {
  let validPasswords = 0;

  for (let password = min; password <= max; password++) {
    if (validatePassword(String(password), allowExtraRepeats)) validPasswords++;
  }

  return validPasswords;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');
  let [_, min, max] = input[0].match(/(\d+)-(\d+)/);

  console.log(`Part one answer: ${validatePasswordRange(min, max, true)}`);
  console.log(`Part two answer: ${validatePasswordRange(min, max, false)}`);
}

module.exports = { main };