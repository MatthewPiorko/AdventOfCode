const fs = require("fs");
const path = require("path");

const COLOR = {
  WHITE: 0,
  BLACK: 1
}

function parseTileInstruction(str) {
  let moves = { "e": 0, "w": 0, "ne": 0, "nw": 0, "se": 0, "sw": 0 };

  let idx = 0;

  while (idx < str.length) {
    let move;
    if (str[idx] == "e" || str[idx] == "w") move = str[idx];
    else move = str.substring(idx, idx + 2);

    moves[move] = (moves[move] || 0) + 1;
    idx += move.length;
  }

  // Turn opposite directions into one axis
  moves["e"] -= moves["w"];
  moves["ne"] -= moves["sw"];
  moves["nw"] -= moves["se"];

  // Consolidate nw into e and ne
  moves["e"] -= moves["nw"];
  moves["ne"] += moves["nw"];

  return [moves["e"], moves["ne"]];
}

function determineFlippedTiles(input) {
  let flips = {};

  let results = input.map(parseTileInstruction);

  for (result of results) {
    flips[result] = !(flips[result] || false);
  }

  return Object.keys(flips).filter(k => flips[k]);
}

function createInitialState(input) {
  let flippedTiles = {};

  let tiles = input.map(parseTileInstruction);

  for (tile of tiles) {
    flippedTiles[tile] = !(flippedTiles[tile] || false);
  }

  let xs = tiles.map(tile => tile[0]);
  let ys = tiles.map(tile => tile[1]);

  let state = [];

  for (let y = Math.min(...ys); y <= Math.max(...ys); y++) {
    let newRow = [];
    for (let x = Math.min(...xs); x <= Math.max(...xs); x++) {
      newRow.push(flippedTiles[[x,y]] === true ? COLOR.BLACK : COLOR.WHITE);
    }
    state.push(newRow);
  }

  return state;
}

// A neighbor is adjacent on the e or ne axis, or on the nw/se axis
const HEXAGONAL_NEIGHBORS = [[1,0], [-1,0], [0,1], [0,-1], [1,-1], [-1,1]];

function countDirectlyAdjacent(state, x, y) {
  return HEXAGONAL_NEIGHBORS.reduce((acc, [dirX, dirY]) =>
    state[y + dirY]?.[x + dirX] == COLOR.BLACK ? acc + 1 : acc, 0);
}

function determineNextColor(color, numAdjacent) {
  if (color == COLOR.WHITE && numAdjacent == 2) return COLOR.BLACK;
  
  if (color == COLOR.BLACK && (numAdjacent == 0 || numAdjacent > 2)) return COLOR.WHITE;
  
  return color;
}

function runStateMachine(input, numSteps) {
  let state = createInitialState(input);

  for (let count = 0; count < numSteps; count++) {
    let newState = [];

    for (let y = -1; y <= state.length; y++) {
      let newRow = [];

      for (let x = -1; x <= state[0].length; x++) {
        let numAdjacent = countDirectlyAdjacent(state, x, y);
        let current = state[y]?.[x] || COLOR.WHITE;
        
        newRow.push(determineNextColor(current, numAdjacent));
      }

      newState.push(newRow);
    }

    state = newState;
  }

  return state.reduce((yAcc, y) => yAcc + 
      y.reduce((xAcc, x) => xAcc + x, 0), 0);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${determineFlippedTiles(input).length}`);
  console.log(`Part two answer: ${runStateMachine(input, 100)}`);
}

module.exports = { main };