const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

const EMPTY = '.';

function replace(board, replace, replaceBy) {
  return board.map(row => row.map(val => val === replace ? replaceBy : val));
}

let hasVerticalBingo = board => _.range(0, board[0].length - 1).some(x => board.every(row => row[x] === EMPTY));
let hasHorizontalBingo = board => board.some(row => row.every(val => val === EMPTY));
let hasBingo = board => hasVerticalBingo(board) || hasHorizontalBingo(board);

function sumBoard(board) {
  return _.sum(board.map(
    row => _.sum(row.map(val => val !== EMPTY ? val : 0))));
}

function parseBoards(inputs) {
  let boards = [];
  for (let i = 0; i <= inputs.length; i+= 6) {
    boards.push(inputs.slice(i, i + 5).map(row => row.trim().split(/\s+/).map(Number)));
  }

  return boards;
}

function partOne(inputs) {
  let bingoNums = inputs[0].split(',').map(Number);
  let boards = parseBoards(inputs.slice(2));

  for (let bingoNum of bingoNums) {
    boards = boards.map(board => replace(board, bingoNum, EMPTY));
    let winningBoards = boards.filter(hasBingo);
    if (winningBoards.length > 0) return sumBoard(winningBoards[0]) * bingoNum;
  }

  return undefined;
}

function partTwo(inputs) {
  let bingoNums = inputs[0].split(',').map(Number);
  let boards = parseBoards(inputs.slice(2));
  let unfinishedBoards = [];

  for (let bingoNum of bingoNums) {
    unfinishedBoards = boards
      .map(board => replace(board, bingoNum, EMPTY))
      .filter(board => !hasBingo(board));

    if (unfinishedBoards.length === 0) return sumBoard(replace(boards[0], bingoNum, EMPTY)) * bingoNum;
    boards = unfinishedBoards;
  }

  return undefined;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };