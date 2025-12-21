const _ = require('../../util/utils.js');

const OPERATIONS = {
  ADD: '+',
  MULT: '*'
};

function transpose(grid) {
  let transposed = _.arr2D(grid.length, grid[0].length);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      transposed[x][y] = grid[y][x];
    }
  }

  return transposed;
}

function solveProblems(numberGrid, operations) {
  let sum = 0;

  for (let i = 0; i < numberGrid.length; i++) {
    let operation = operations[i];
    let numbers = numberGrid[i];

    if (operation === OPERATIONS.ADD) sum += _.sum(numbers);
    if (operation === OPERATIONS.MULT) sum += _.product(numbers);
  }

  return sum;
}

function partOne(inputs, testMode) {
  let operations = inputs.slice(-1)[0].split(/\s+/);

  // parse numbers first, then transpose
  let numberGrid = inputs.slice(0, -1).map(input => input.split(/\s+/).filter(s => s.trim().length > 0).map(Number));
  numberGrid = transpose(numberGrid);

  return solveProblems(numberGrid, operations);
}

function partTwo(inputs, testMode) {
  let operations = inputs.slice(-1)[0].split(/\s+/);

  // transpose first, then parse numbers
  let numberGrid = transpose(inputs.slice(0, -1)).map(row => row.join('').trim());
  numberGrid = numberGrid.join('\n').split('\n\n').map(problem => problem.split('\n').map(Number));

  return solveProblems(numberGrid, operations);
}

module.exports = { partOne, partTwo };