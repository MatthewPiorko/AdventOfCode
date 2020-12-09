const fs = require("fs");
const path = require("path");

let requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
let validEyeColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

function validateField(field, value) {
  let numericValue = Number(value);

  switch (field) {
    case "byr":
      return numericValue >= 1920 && numericValue <= 2002;
    case "iyr":
      return numericValue >= 2010 && numericValue <= 2020;
    case "eyr":
      return numericValue >= 2020 && numericValue <= 2030;
    case "hgt":
      let heightRegex = value.match(/(\d+)(\w+)/);
      let height = heightRegex[1], type = heightRegex[2];

      if (type == "cm") return height >= 150 && height <= 193;
      else if (type == "in") return height >= 59 && height <= 76;
      else return false;
    case "hcl":
      return value.match(/^#[a-f0-9]{6}$/);
    case "ecl":
      return validEyeColors.includes(value);
    case "pid":
      return value.match(/^[0-9]{9}$/);
    case "cid":
      return true;
  }
}

function containsRequiredFields(input) {
  return requiredFields.every(field => input.includes(field));
}

function containsValidFields(input) {
  let fieldsWithValues = input.split(' ');

  return fieldsWithValues.every(fieldWithValue => {
    let fieldWithValueGroups = fieldWithValue.match(/(\w+):(.*)/);
    let field = fieldWithValueGroups[1], value = fieldWithValueGroups[2];

    return validateField(field, value);
  });
}

function main() {
  fs.readFile(path.resolve(__dirname, 'input.txt'), function (err, data) {
    let input = data.toString().split('\n').map(s => s.trim());

    let numHaveRequiredFields = input.map(containsRequiredFields)
      .reduce((acc, val) => acc + val, 0);
    console.log(numHaveRequiredFields);

    let numValid = input.map(str => containsRequiredFields(str) && containsValidFields(str))
      .reduce((acc, val) => acc + val, 0);
    console.log(numValid);
  });
}

module.exports = { main };