const fs = require("fs");
const path = require("path");

function determineWaitTime(input) {
  let originalDepartureTime = Number(input[0]);
  let departureTime = originalDepartureTime;
  let times = input[1].split(',').map(Number).filter(n => !isNaN(n));

  while (true) {
    for (time of times) {
      if (Number.isInteger(departureTime / time)) {
        return time * (departureTime - originalDepartureTime);
      }
    }

    departureTime++;
  }
}

// 4 seems to be a local minimum for runtime 
// to optimize as little time searching for the initial timestamp, but as large a step size as possible
const NUM_TO_DETERMINE_START = 4;
const MINIMUM_VALUE = 100000000000000;

function isEvenlyDivisible(timestamp, time) {
  return isNaN(time) || Number.isInteger((timestamp / time));
}

// Determine an initial timestamp that works for the highest N wait times, and is above the minimum
// and determine the step size as the product of the highest N wait times
function calculateStartingTimestamp(sortedTimes) {
  let startingTime = sortedTimes[0];
  let timestamp = Math.floor(MINIMUM_VALUE / startingTime[0]) * startingTime[0] - startingTime[1];

  let firstNTimes = sortedTimes.splice(0, NUM_TO_DETERMINE_START);

  while (!firstNTimes.every(([time, index]) => isEvenlyDivisible(timestamp + index, time))) {
    timestamp += startingTime[0];
  }

  let stepSize = firstNTimes.reduce((acc, [time, index]) => acc * time, 1);
  return [timestamp, stepSize];
}

// Determine the first time that all buses leave on subsequent timestamps
function calculateFirstSubsequentTime(input) {
  let times = input[1].split(',').map(Number);
  let sortedTimes = times.map((time, index) => [time, index]).sort((a,b) => b[0] - a[0]);

  let [timestamp, stepSize] = calculateStartingTimestamp(sortedTimes);

  while (true) {
    if (sortedTimes.every(([time, index]) => isEvenlyDivisible(timestamp + index, time))) return timestamp;

    timestamp += stepSize;
  }

  return timestamp;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${determineWaitTime(input)}`);
  console.log(`Part two answer: ${calculateFirstSubsequentTime(input)}`);
}

module.exports = { main };