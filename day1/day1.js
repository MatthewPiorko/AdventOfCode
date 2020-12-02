var fs = require("fs");

// Find two numbers that add to sum, and return their product
function findPairSum(integers, sum) {
  let set = new Set();

  for (let i of integers) set.add(sum - i);
  for (let i of integers) {
    if (set.has(i)) return i * (sum - i);
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

fs.readFile('input.txt', function (err, data) {
  let input = data.toString().split('\n').map(Number);
  console.log(findPairSum(input, 2020));
  console.log(findTripleSum(input, 2020));
});