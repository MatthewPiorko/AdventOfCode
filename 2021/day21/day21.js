const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// Bound a number between 1 and max
function bound(num, max) {
  return (num - 1) % max + 1;
}

const DIE_FACES = [1,2,3];

function computeQuantumRolls() {
  let possibilities = [];
  
  for (let roll1 of DIE_FACES) {
    for (let roll2 of DIE_FACES) {
      for (let roll3 of DIE_FACES) {
        possibilities.push(roll1 + roll2 + roll3);
      }
    }
  }

  return possibilities;
}

let QUANTUM_DIE_ROLLS = computeQuantumRolls();
let PART_TWO_MAX = 21;

function parseInputs(inputs) {
  let [player1String, player1Pos] = inputs[0].match(/Player 1 starting position: (\d+)/);
  let [player2String, player2Pos] = inputs[1].match(/Player 2 starting position: (\d+)/);
  return [Number(player1Pos), Number(player2Pos)];
}

function quantumDirac(player1Score, player2Score, player1Place, player2Place, currentPlayer, cache = {}) {
  let entry = `${player1Score},${player2Score},${player1Place},${player2Place},${currentPlayer}`;
  if (cache[entry] !== undefined) return cache[entry];

  if (player1Score >= PART_TWO_MAX) return [1, 0];
  if (player2Score >= PART_TWO_MAX) return [0, 1];

  let wins = [0, 0];

  for (let sum of QUANTUM_DIE_ROLLS) {
    let player1Wins, player2Wins;

    if (currentPlayer === 1) {
      let newPlayer1Pos = bound(player1Place + sum, 10);
      [player1Wins, player2Wins] = quantumDirac(player1Score + newPlayer1Pos, player2Score, newPlayer1Pos, player2Place, 2, cache);
    }
    else {
      let newPlayer2Pos = bound(player2Place + sum, 10);
      [player1Wins, player2Wins] = quantumDirac(player1Score, player2Score + newPlayer2Pos, player1Place, newPlayer2Pos, 1, cache);
    }

    wins[0] += player1Wins;
    wins[1] += player2Wins;
  }

  cache[entry] = wins;
  return wins;
}

function partOne(inputs) {
  let scores = [0, 0];
  let places = parseInputs(inputs);
  let die = 1, numRolls = 0;
  let currentPlayer = 0;

  while (scores[0] < 1000 && scores[1] < 1000) {
    places[currentPlayer] = bound(places[currentPlayer] + (die * 3) + 3, 10);
    scores[currentPlayer] = scores[currentPlayer] + places[currentPlayer];

    die = bound(die + 3, 100);
    numRolls += 3;

    currentPlayer = (currentPlayer + 1) % 2;
  }

  return _.min(scores) * numRolls;
}

function partTwo(inputs) {
  let [player1Start, player2Start] = parseInputs(inputs);
  let [player1Wins, player2Wins] = quantumDirac(0, 0, player1Start, player2Start, 1);
  return Math.max(player1Wins, player2Wins);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };