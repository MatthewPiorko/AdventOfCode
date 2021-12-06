const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

class LinkedMarble {
  constructor(number, prev, next) {
    this.number = number;
    this.prev = prev;
    this.next = next;
  }
}

function deleteMarbleAt(marble, pos) {
  while (pos > 0) {
    marble = marble.prev;
    pos--;
  }

  marble.prev.next = marble.next;
  return marble;
}

function printMarbles(marble) {
  while (marble.number != 0) marble = marble.next;
  marble = marble.next;

  let str = "0 ";
  while (marble.number != 0) {
    str += marble.number + " ";
    marble = marble.next;
  }
  console.log(str);
}

function determineWinningScore(numPlayers, maxMarble) {
  let scores = _.range(0, Number(numPlayers), 0);
  
  let currentMarble = new LinkedMarble(0, undefined, undefined);
  currentMarble.prev = currentMarble;
  currentMarble.next = currentMarble;
  let currentNumber = 1;
  let currentPlayer = 0;

  while (currentNumber <= maxMarble) {
    if (currentNumber % 23 === 0) {
      let deletedMarble = deleteMarbleAt(currentMarble, 7);
      
      scores[currentPlayer] += deletedMarble.number + currentNumber;
      currentMarble = deletedMarble.next;
    } else {
      // Insert the new marble between one away and two away
      let oneAway = currentMarble.next;
      let twoAway = oneAway.next;

      let newMarble = new LinkedMarble(currentNumber, oneAway, twoAway);

      oneAway.next = newMarble;
      twoAway.prev = newMarble;

      currentMarble = newMarble;
    }

    currentPlayer = (currentPlayer + 1) % numPlayers;
    currentNumber++;
  }

  return _.max(scores);
}

function partOne(inputs) {
  let [group, numPlayers, maxMarble] = inputs[0].match(/(\d+) players; last marble is worth (\d+) points/);
  maxMarble = Number(maxMarble);
  numPlayers = Number(numPlayers);

  return determineWinningScore(numPlayers, maxMarble);
}

function partTwo(inputs) {
  let [group, numPlayers, maxMarble] = inputs[0].match(/(\d+) players; last marble is worth (\d+) points/);
  maxMarble = Number(maxMarble);
  numPlayers = Number(numPlayers);

  return determineWinningScore(numPlayers, maxMarble * 100);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };