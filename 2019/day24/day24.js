const fs = require("fs");
const path = require("path");

const ADJACENT_DIRECTIONS = [
  [-1, 0], [1, 0], [0, -1], [0, 1]
];

const STATE = {
  ALIVE: '#',
  DEAD: '.',
  CENTER: '?'
};

const SIZE = 5;

function safeGet(state, x, y) {
  if (x < 0 || y < 0) return STATE.DEAD;
  if (y >= state.length || x >= state[0].length) return STATE.DEAD;

  return state[y][x];
}

function printState(state) {
  for (let y = 0; y < state.length; y++) {
    let s = "";
    for (let x = 0; x < state[y].length; x++) {
      s += state[y][x];
    }
    console.log(s);
  }

  console.log('');
}

function isAlive(char, adjAlive) {
  let currentlyAlive = char === STATE.ALIVE;

  if (currentlyAlive && adjAlive === 1) {
    return STATE.ALIVE;
  } else if (currentlyAlive && adjAlive !== 1) {
    return STATE.DEAD;
  } else if (!currentlyAlive && (adjAlive === 1 || adjAlive === 2)) {
    return STATE.ALIVE;
  } else if (!currentlyAlive) {
    return STATE.DEAD;
  }
}

function determineNextState(state) {
  let nextState = [];  

  for (let y = 0; y < state.length; y++) {
    let row = [];
    for (let x = 0; x < state[y].length; x++) {
      let next = undefined;
      let adjAlive = 0;
      for (let [deltaX, deltaY] of ADJACENT_DIRECTIONS) {
        if (safeGet(state, x + deltaX, y + deltaY) === STATE.ALIVE) adjAlive++;
      }

      row.push(isAlive(state[y][x], adjAlive));
    }
    nextState.push(row);
  }

  return nextState;
}

function stringifyState(state) {
  let s = "";
  for (let y = 0; y < state.length; y++) {
    for (let x = 0; x < state[y].length; x++) {
      s += state[y][x];
    }
    s += ",";
  }

  return s;
}

function calculateBioDiversity(state) {
  let bioDiversity = 0;

  for (let i = 0; i < SIZE * SIZE; i++) {
    if (state[Math.floor(i / SIZE)][i % SIZE] === STATE.ALIVE) bioDiversity += 2 ** i;
  }

  return bioDiversity;
}

function partOne(state) {
  let seenStates = new Set();

  for (let i = 0; i < 100; i++) {
    let stringified = stringifyState(state);
    if (seenStates.has(stringified)) {
      return calculateBioDiversity(state);
    }
    seenStates.add(stringified);

    state = determineNextState(state);
  }

  return undefined;
}

function isEmpty(state, i) {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (state[i][y][x] === STATE.ALIVE) return false;
    }
  }

  return true;
}

function safeGet3D(state, recursionLevel, x, y) {
  if (recursionLevel < 0 || x < 0 || y < 0) return STATE.DEAD;
  if (recursionLevel >= state.length || y >= state[recursionLevel].length || x >= state[recursionLevel][y].length) return STATE.DEAD;

  return state[recursionLevel][y][x];
}

const EDGE = {
  TOP: [0, 0, 1, 0],
  RIGHT: [4, 0, 0, 1],
  BOTTOM: [0, 4, 1, 0],
  LEFT: [0, 0, 0, 1]
}

function numAliveOnEdge(state, recursionLevel, edge) {
  let numAlive = 0;
  let [x, y, deltaX, deltaY] = edge;

  for (let i = 0; i < SIZE; i++) {
    if (safeGet3D(state, recursionLevel, x + (deltaX * i), y + (deltaY * i)) === STATE.ALIVE) numAlive++;
  }

  return numAlive;
}

function numAdjacentAlive(state, recursionLevel, x, y) {
  let adjAlive = 0;
  for (let [deltaX, deltaY] of ADJACENT_DIRECTIONS) {
      if (safeGet3D(state, recursionLevel, x + deltaX, y + deltaY) === STATE.ALIVE) adjAlive++;
  }

  // If on the outer edge, check the layer outside
  if (x === 0 && safeGet3D(state, recursionLevel - 1, 1, 2) === STATE.ALIVE) adjAlive++;
  if (x === 4 && safeGet3D(state, recursionLevel - 1, 3, 2) === STATE.ALIVE) adjAlive++;
  if (y === 0 && safeGet3D(state, recursionLevel - 1, 2, 1) === STATE.ALIVE) adjAlive++;
  if (y === 4 && safeGet3D(state, recursionLevel - 1, 2, 3) === STATE.ALIVE) adjAlive++;

  // If on the inner edge, check the layer inside
  if (x === 2 && y === 1) adjAlive += numAliveOnEdge(state, recursionLevel + 1, EDGE.TOP);
  if (x === 1 && y === 2) adjAlive += numAliveOnEdge(state, recursionLevel + 1, EDGE.LEFT);
  if (x === 3 && y === 2) adjAlive += numAliveOnEdge(state, recursionLevel + 1, EDGE.RIGHT);
  if (x === 2 && y === 3) adjAlive += numAliveOnEdge(state, recursionLevel + 1, EDGE.BOTTOM);

  return adjAlive;
}

function printState3D(state) {
  for (let recursion = 0; recursion < state.length; recursion++) {
    console.log(`Layer ${recursion}:`);
    for (let y = 0; y < state[recursion].length; y++) {
      let s = "";
      for (let x = 0; x < state[recursion][y].length; x++) {
        s += state[recursion][y][x];
      }
      console.log(s);
    }

    console.log('\n');
  }

  console.log('---------------------');
}

function nextState3D(state) {
  let newState = [];

  for (let recursion = -1; recursion < state.length + 1; recursion++) {
    let newRecursion = [];
    for (let y = 0; y < SIZE; y++) {
      let newRow = [];
      for (let x = 0; x < SIZE; x++) {
        if (y === 2 && x === 2) { 
          newRow.push(STATE.CENTER); 
          continue; 
        }

        let adjAlive = numAdjacentAlive(state, recursion, x, y);
        let currentState = safeGet3D(state, recursion, x, y);

        newRow.push(isAlive(currentState, adjAlive));
      }
      newRecursion.push(newRow);
      newRow = [];
    }
    newState.push(newRecursion);
    newRecursion = [];
  }

  return newState;
}

const NUM_ITER = 200;

function totalAlive(state) {
  let numAlive = 0;

  for (let recursion = 0; recursion < state.length; recursion++) {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (state[recursion][y][x] === STATE.ALIVE) numAlive++;
      }
    }
  }

  return numAlive;
}

function partTwo(input) {
  input[2][2] = STATE.CENTER;
  let state = [input];

  for (let i = 0; i < NUM_ITER; i++) {
    state = nextState3D(state);

    if (isEmpty(state, 0)) state = state.slice(1);
    if (isEmpty(state, state.length - 1)) state = state.slice(0, state.length - 1);
  }

  return totalAlive(state);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  input = input.map(row => row.split(''));

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };