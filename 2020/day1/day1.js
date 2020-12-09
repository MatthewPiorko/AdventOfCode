var fs = require("fs");
var path = require("path");

// Find two numbers that add to sum, and return their product
function findPairSum(integers, sum) {
  let set = new Set();

  for (let i of integers) {
    if (set.has(i)) return i * (sum - i);
    
    set.add(sum - i);
  }

  return -1;
}

// Find three numbers that add to sum, and return their product
function findTripleSum(integers, sum) {
  for (let i of integers) {
    let pairSum = findPairSum(integers, sum - i);
    if (pairSum != -1) return i * pairSum;
  }

  return -1;
}

function main() {
  fs.readFile(path.resolve(__dirname, 'input.txt'), function (err, data) {
    let input = data.toString().split('\n').map(Number);
    console.log(findPairSum(input, 2020));
    console.log(findTripleSum(input, 2020));
  });
}

module.exports = { main, findPairSum };