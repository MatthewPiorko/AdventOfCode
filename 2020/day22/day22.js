const fs = require("fs");
const path = require("path");

function computeScore(cards) {
  return cards.reduce((acc, val, idx) => acc + (val * (cards.length - idx)), 0);
}

function playCombat(player1Deck, player2Deck) {
  while (player1Deck.length > 0 && player2Deck.length > 0) {
    let p1 = player1Deck[0];
    player1Deck = player1Deck.slice(1);

    let p2 = player2Deck[0];
    player2Deck = player2Deck.slice(1);

    if (p1 > p2) {
      player1Deck.push(p1);
      player1Deck.push(p2);
    } else if (p2 > p1) {
      player2Deck.push(p2);
      player2Deck.push(p1);
    }
  }

  return computeScore(player1Deck.length != 0 ? player1Deck : player2Deck);
}

function stringifyPosition(player1Deck, player2Deck) {
  return player1Deck.join(",") + ";" + player2Deck.join(",");
}

const PLAYER = {
  ME: 1,
  CRAB: 2
};

function playRecursiveCombat(player1Deck, player2Deck) {
  let seenGames = new Set();
  let winner = 0;

  while (player1Deck.length > 0 && player2Deck.length > 0) {
    let str = stringifyPosition(player1Deck, player2Deck);

    if (seenGames.has(str)) return [PLAYER.ME, player1Deck];

    seenGames.add(str);

    let p1 = player1Deck[0];
    player1Deck = player1Deck.slice(1);

    let p2 = player2Deck[0];
    player2Deck = player2Deck.slice(1);

    if (player1Deck.length >= p1 && player2Deck.length >= p2) {
      [winner, _] = playRecursiveCombat(player1Deck.slice(0, p1), player2Deck.slice(0, p2));
    } else {
      if (p1 > p2) winner = PLAYER.ME;
      else if (p2 > p1) winner = PLAYER.CRAB;
    }

    if (winner == PLAYER.ME) {
      player1Deck.push(p1);
      player1Deck.push(p2);
    } else if (winner == PLAYER.CRAB) {
      player2Deck.push(p2);
      player2Deck.push(p1);
    }
  }

  if (winner == PLAYER.ME) return [PLAYER.ME, player1Deck];
  else return [PLAYER.CRAB, player2Deck];
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  let splitIdx = input.indexOf("");

  let player1Deck = input.slice(1, splitIdx).map(Number);
  let player2Deck = input.slice(splitIdx + 2).map(Number);

  console.log(`Part one answer: ${playCombat(player1Deck, player2Deck)}`);

  let [_, partTwoWinningDeck] = playRecursiveCombat(player1Deck, player2Deck);
  console.log(`Part two answer: ${computeScore(partTwoWinningDeck)}`);
}

module.exports = { main };