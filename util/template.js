var fs = require("fs");

function compute(input) {
  return false;
}

function computePartTwo(input) {
  return false;
}

fs.readFile('input.txt', function (err, data) {
  let input = data.toString().split('\n').map(s => s.trim());
  console.log(compute(input));
  console.log(computePartTwo(input));
});