const fs = require("fs");
const path = require("path");

let ORTHOGONAL_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, +1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

// Get a position in the grid, or '.' if it's outside the grid
function safeGet(state, x, y) {
  if (x >= 0 && x < state[0].length && y >= 0 && y < state.length) return state[y][x];
  else return '.';
}

function countDirectlyAdjacent(state, x, y) {
  return ORTHOGONAL_DIRECTIONS.reduce((acc, [dirX, dirY]) =>
    safeGet(state, x + dirX, y + dirY) == '#' ? acc + 1 : acc, 0);
}

// Returns 1 if an occupied seat is visible from a given {x,y} in the direction of {dirX, dirY}
function findInDirection(state, x, y, dirX, dirY) {
  while (x < state[0].length && x >= 0 && y < state.length && y >= 0) {
    x += dirX;
    y += dirY;

    switch (safeGet(state, x, y)) {
      case '.':
        continue;
      case 'L':
        return false;
      case '#':
        return true;
    }
  }

  return false;
}

function countVisibleSeats(state, x, y) {
  return ORTHOGONAL_DIRECTIONS.reduce((acc, [dirX, dirY]) => 
    acc + findInDirection(state, x, y, dirX, dirY), 0);
}

function hasStateChanged(oldState, newState) {
  for (let y = 0; y < oldState.length; y++) {
    for (let x = 0; x < oldState[0].length; x++) {
      if (oldState[y][x] != newState[y][x]) return true;
    }
  }

  return false;
}

function nextState(state, adjacencyFunction, overcrowdedAmount) {
  let newState = [];
  for (let y = 0; y < state.length; y++) {
    let newRow = [];
    for (let x = 0; x < state[0].length; x++) {
      if (state[y][x] == '.') {
        newRow.push('.');
        continue;
      }

      let count = adjacencyFunction(state, x, y);

      if (state[y][x] == 'L' && count == 0) {
        newRow.push('#');
      } else if (state[y][x] == '#' && count >= overcrowdedAmount) {
        newRow.push('L');
      } else {
        newRow.push(state[y][x]);
      }
    }
    newState.push(newRow);
  }

  return newState;
}

function findFixedPointState(state, adjancencyFunction, overcrowdedAmount) {
  while (true) {
    let newState = nextState(state, adjancencyFunction, overcrowdedAmount);

    if (!hasStateChanged(newState, state)) return newState;

    state = newState;
  }
}

function countUnoccupiedSeats(state) {
  return state.reduce((acc, row) =>
    acc + row.reduce((rowAcc, seat) => rowAcc + (seat == '#'), 0), 0);
}

function main() {
  let initialState = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/)
    .map(row => row.split(''));

  let partOneResult = countUnoccupiedSeats(findFixedPointState(initialState, countDirectlyAdjacent, 4));
  console.log(`Part one answer: ${partOneResult}`);

  let partTwoResult = countUnoccupiedSeats(findFixedPointState(initialState, countVisibleSeats, 5))
  console.log(`Part two answer: ${partTwoResult}`);
}

module.exports = { main };