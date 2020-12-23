const fs = require("fs");
const path = require("path");

function crabGame(input, numCups, numSteps) {
  // Cups is a array of cup number => next cup number
  let cups = new Array(numCups + 1).fill(0).map((_, idx) => idx + 1);
  cups[numCups] = order[0];

  for (let i = 0; i < order.length; i++) {
    cups[order[i]] = order[i + 1];
  }

  cups[order[order.length - 1]] = numCups == input.length ? order[0] : order.length + 1

  let current = order[0];

  // To play a round, insert the three elements between the destination cup and it's following cup
  for (let i = 0; i < numSteps; i++) {
    let nextThree = [cups[current], cups[cups[current]], cups[cups[cups[current]]]];
    let destination = current - 1;

    while (nextThree.indexOf(destination) != -1 || destination <= 0) {
      destination = destination <= 1 ? numCups : destination - 1;
    }

    let next = cups[destination];
    cups[destination] = nextThree[0];

    let nextAfterSplit = cups[nextThree[2]];
    cups[nextThree[2]] = next;

    cups[current] = nextAfterSplit;
    current = cups[current];
  }

  return cups;
}

function endingCupOrder(startingOrder, numCups, numSteps) {
  let cups = crabGame(startingOrder, numCups, numSteps);

  let current = 1;
  let order = "";

  while (cups[current] != 1) {
    order += cups[current];
    current = cups[current];
  }

  return order;
}

function productOfNextCups(startingOrder, numCups, numSteps) {
  let endingOrder = crabGame(startingOrder, numCups, numSteps);

  return endingOrder[1] * endingOrder[endingOrder[1]];
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  order = input[0].split("").map(Number);

  console.log(`Part one answer: ${endingCupOrder(order, 9, 100)}`);
  console.log(`Part two answer: ${productOfNextCups(order, 1000000, 10000000)}`);
}

module.exports = { main };