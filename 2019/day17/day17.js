const fs = require("fs");
const path = require("path");

const { runInstructionsOnList } = require("../common/intcode-compiler");

const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
}

function printBoard(board) {
  for (y in board) {
    let s = '';
    for (x in board[y]) {
      s += board[y][x];
    }
    console.log(s);
  }
}

// Returns character at position x, y
// or empty if no character
function safeGet(board, x, y) {
  if (x < 0 || y < 0) return '';
  if (y >= board.length || x >= board[0].length) return '';

  return board[y][x];
}

function isIntersection(board, x, y) {
  return safeGet(board, x, y) === '#' &&
    safeGet(board, x - 1, y) === '#' &&
    safeGet(board, x + 1, y) === '#' &&
    safeGet(board, x, y - 1) === '#' &&
    safeGet(board, x, y + 1) === '#';
}

function partOne(instrs) {
  let output = runInstructionsOnList(instrs, []);

  let board = [];
  let row = [];
  for (let i = 0; i < output.length; i++) {
    character = String.fromCharCode(output[i]);
    if (character === '\n') {
      board.push(row);
      row = [];
    } else {
      row.push(character);
    }
  }

  // printBoard(board);

  let sum = 0;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (isIntersection(board, x, y)) {
        sum += x * y;
      }
    }
  }

  return sum;
}

function findRobot(board) {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === '^') return [y, x];
    }
  }
}

function findPath(board) {
  let [robotY, robotX] = findRobot(board);
  let direction = DIRECTION.RIGHT;
  let length = 0;

  let path = ["R"];

  for (let i = 0; i < 1000; i++) {
    switch (direction) {
      case DIRECTION.UP:
        if (safeGet(board, robotX, robotY - 1) === '#') {
          length++;
          robotY--;
        } else if (safeGet(board, robotX - 1, robotY) === '#') {
          path.push(length);
          length = 0;
          path.push("L");
          direction = DIRECTION.LEFT;
        } else if (safeGet(board, robotX + 1, robotY) === '#') {
          path.push(length);
          length = 0;
          path.push("R");
          direction = DIRECTION.RIGHT;
        } else {
          path.push(length);
          return path;
        }
        break;

      case DIRECTION.RIGHT:
        if (safeGet(board, robotX + 1, robotY) === '#') {
          length++;
          robotX++;
        } else if (safeGet(board, robotX, robotY + 1) === '#') {
          path.push(length);
          length = 0;
          path.push("R");
          direction = DIRECTION.DOWN;
        } else if (safeGet(board, robotX, robotY - 1) === '#') {
          path.push(length);
          length = 0;
          path.push("L");
          direction = DIRECTION.UP;
        } else {
          path.push(length);
          return path;
        }
        break;

      case DIRECTION.DOWN:
        if (safeGet(board, robotX, robotY + 1) === '#') {
          length++;
          robotY++;
        } else if (safeGet(board, robotX - 1, robotY) === '#') {
          path.push(length);
          length = 0;
          path.push("R");
          direction = DIRECTION.LEFT;
        } else if (safeGet(board, robotX + 1, robotY) === '#') {
          path.push(length);
          length = 0;
          path.push("L");
          direction = DIRECTION.RIGHT;
        } else {
          path.push(length);
          return path;
        }
        break;

      case DIRECTION.LEFT:
        if (safeGet(board, robotX - 1, robotY) === '#') {
          length++;
          robotX--;
        } else if (safeGet(board, robotX, robotY - 1) === '#') {
          path.push(length);
          length = 0;
          path.push("R");
          direction = DIRECTION.UP;
        } else if (safeGet(board, robotX, robotY + 1) === '#') {
          path.push(length);
          length = 0;
          path.push("L");
          direction = DIRECTION.DOWN;
        } else {
          path.push(length);
          return path;
        }
        break;
    }
  }

  return [];
}

function listEquals(list1, list2) {
  if (list1.length !== list2.length) return false;

  for (let i = 0; i < list1.length; i++) {
    if (list1[i] !== list2[i]) return false;
  }

  return true;
}

function determineBestChain(path) {
  for (let chainLength = Math.min(8, path.length / 2); chainLength > 0; chainLength-=2) {
    for (let chainStart = 0; chainStart < path.length - chainLength; chainStart+=2) {
      let chain = path.slice(chainStart, chainStart + chainLength);
      let chainCount = 0;
      for (let i = 0; i < path.length; i+=2) {
        if (listEquals(path.slice(i, i + chainLength), chain)) {
          chainCount++;
        }
      }
      
      if (chainCount > 1) {
        console.log(chain.join(','));
        console.log(chainCount);
        // return chain;
      }
    }
  }
}

function partTwo(instrs) {
  /*let getInput = () => 0;
  let board = [];
  let row = [];
  let handleOutput = (asciiInt) => {
    character = String.fromCharCode(asciiInt);
    if (character === '\n') {
      board.push(row);
      row = [];
    } else {
      row.push(character);
    }
  }

  runInstructions(instrs, getInput, handleOutput);

  printBoard(board);

  let path = findPath(board).map(String);
  console.log(path.join(','));
  console.log(path.length);

  let chain = determineBestChain(path);
  console.log(chain);
  console.log(chain.join(','));*/

  // Determined by manual solving the output of the above chaining

  let main = 'C,A,C,A,B,A,B,C,A,B'.split('');
  let chainA = 'R,10,R,6,R,4'.split('');
  let chainB = 'R,4,L,12,R,6,L,12'.split('');
  let chainC = 'R,4,R,10,R,8,R,4'.split('');

  let allInputs = main.concat(['\n'])
    .concat(chainA).concat(['\n'])
    .concat(chainB).concat(['\n'])
    .concat(chainC).concat(['\n'])
    .concat(['n', '\n'])
    .map(c => c.charCodeAt(0));
  console.log(allInputs);

  instrs[0] = '2';
  let output = runInstructionsOnList(instrs, allInputs);

  return output[output.length - 1];
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',');

  console.log(`Part one answer: ${partOne(instrs.map(String))}`);
  console.log(`Part two answer: ${partTwo(instrs.map(String))}`);
}

module.exports = { main };