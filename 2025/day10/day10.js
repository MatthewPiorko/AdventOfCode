const _ = require('../../util/utils.js');

function partOne(inputs, testMode) {
  let problems = inputs.map(parseInput);
  return _.sum(problems.map(solveBFS));
}

function parseInput(input) {
  let [match, desiredToggles, buttons, desiredJoltage] = input.match(/\[(.*)\] (.*) \{(.*)\}/);
  desiredToggles = desiredToggles.split('').map(str => str === '#');
  buttons = buttons.split(' ').map(str => {
      // filter out parenthesis of (1,3)
      str = str.slice(1, str.length - 1);
      return str.split(',').map(Number);
    });
  desiredJoltage = desiredJoltage.split(',').map(Number);

  return [desiredToggles, buttons, desiredJoltage];
}

function solveBFS([desiredToggles, buttons, joltage]) {
  let solvedState = desiredToggles.join('');
  let frontier = [[desiredToggles.map(i => false), 0]];
  let best = +Infinity;
  let visited = new Set();

  while (frontier.length > 0) {
    let [state, cost] = frontier.shift();

    if (cost > best) continue;

    let key = `${state.join('')},${cost}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (state.join('') === solvedState) {
      best = cost;
      continue;
    }

    for (let button of buttons) {
      let proposedState = state.map(i => i);
      for (let index of button) proposedState[index] = !proposedState[index];

      frontier.push([proposedState, cost + 1]);
    }
  }

  return best;
}

// using custom Number to avoid floating point issues
class Decimal {
  constructor (numerator, denominator = 1) {
    if (denominator !== 1 && Number.isInteger(denominator / numerator)) {
      let gcd = _.gcd(numerator, denominator);
      numerator = numerator / gcd;
      denominator = denominator / gcd;
    }

    this.numerator = numerator;
    this.denominator = denominator;
  }

  multiply(other) {
    return new Decimal(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  divide(other) {
    return new Decimal(this.numerator * other.denominator, this.denominator * other.numerator);
  }

  subtract(other) {
    if (other.denominator !== this.denominator) {
      let lcm = _.lcm(this.denominator, other.denominator);
      
      let newNumerator = this.numerator * (lcm / this.denominator) - other.numerator * (lcm / other.denominator)
      return new Decimal(newNumerator, lcm);
    }

    return new Decimal(this.numerator - other.numerator, this.denominator);
  }

  toNumber() {
    return this.numerator / this.denominator;
  }
}

function partTwo(inputs, testMode) {
  let problems = inputs.map(parseInput);
  return _.sum(problems.map(solveLinearAlgebra));
}

function solveLinearAlgebra([desiredToggles, buttons, desiredJoltage]) {
  let matrix = _.arr2D(buttons.length, desiredJoltage.length, 0);
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      matrix[y][x] = buttons[x].indexOf(y) >= 0 ? new Decimal(1) : new Decimal(0);
    }
    matrix[y].push(new Decimal(desiredJoltage[y]));
  }

  let reduced = gaussJordanElimination(matrix);

  if (isInReducedRowEchelonForm(reduced)) {
    let lastColumn = reduced.map(row => row.pop(-1).toNumber());

    // if some button needs to be pressed a negative number of times, or partial number of times, ignore it
    // this only happens when exploring free variables
    if (lastColumn.some(x => x < 0)) return +Infinity;
    if (lastColumn.some(x => Math.ceil(x) !== Math.floor(x))) return +Infinity;

    return _.sum(lastColumn);
  } 

  // if it's not fully reduced, need to find the right values for the free variables
  // brute force all possible values
  let freeVariable = firstFreeVariable(reduced);
  let lastColumn = matrix.filter(row => row[freeVariable].toNumber() !== 0).map(row => row.at(-1));
  let max = _.max(lastColumn.map(x => x.toNumber()));

  let bestSolution = +Infinity;
  for (let value = 0; value <= max; value++) {
    let newButtons = [...buttons.slice(0, freeVariable), ...buttons.slice(freeVariable + 1)];
    let newDesiredJoltage = desiredJoltage.map(i => i);

    let isInvalid = false;
    for (let index of buttons[freeVariable]) {
      newDesiredJoltage[index] -= value;
      if (newDesiredJoltage[index] < 0) isInvalid = true;
      if (Math.floor(newDesiredJoltage[index]) !== Math.ceil(newDesiredJoltage[index])) isInvalid = true;
    }
    if (isInvalid) continue;

    bestSolution = Math.min(bestSolution, value + solveLinearAlgebra([desiredToggles, newButtons, newDesiredJoltage]));
  }

  return bestSolution;
}

function gaussJordanElimination(matrix) {
  let reducedMatrix = matrix.map(row => row.map(i => i));
  let leadingColumn = 0;

  for (let i = 0; i < matrix.length; i++) {
    if (leadingColumn > matrix[0].length - 1) break;

    // if this starts with a zero, swap one that doesn't into this row
    if (reducedMatrix[i][leadingColumn].toNumber() === 0) {
      for (let j = leadingColumn + 1; j < matrix.length; j++) {
        if (reducedMatrix[j][leadingColumn].toNumber() !== 0) {
          [reducedMatrix[i], reducedMatrix[j]] = [reducedMatrix[j], reducedMatrix[i]];
          break;
        }
      }
    }

    let lead = reducedMatrix[i][leadingColumn];
    // if every row leads with a 0, this is a free variable so retry this row on the next column
    if (lead.toNumber() === 0) { i--; leadingColumn++; continue; }

    if (lead.toNumber() !== 1) {
      // normalize the row to be [1, ...]
      for (let j = 0; j < reducedMatrix[i].length; j++) reducedMatrix[i][j] = reducedMatrix[i][j].divide(lead);
    }

    // remove the leadingColumn value from all rows
    // e.g. in a row of [3,5,10] with a leading row of [1,0,2]: 
    //    [3, 5, 10] - 3 * [1, 0, 2] = [0, 0, 4]
    for (let j = 0; j < matrix.length; j++) {
      if (i === j) continue;
      if (reducedMatrix[j][leadingColumn].toNumber() === 0) continue;

      let multiple = reducedMatrix[j][leadingColumn];
      for (let k = 0; k < matrix[j].length; k++) {
        reducedMatrix[j][k] = reducedMatrix[j][k].subtract(reducedMatrix[i][k].multiply(multiple));
      }
    }

    leadingColumn++;
  }

  return reducedMatrix;
}

function firstFreeVariable(matrix) {
  for (let x = 0; x < matrix[0].length - 1; x++) {
    let seenNonZero = false;
    for (let y = 0; y < matrix.length; y++) {
      if (matrix[y][x].toNumber() !== 0 && seenNonZero) return x;
      if (matrix[y][x].toNumber() !== 0 && !seenNonZero) seenNonZero = true;
    }
  }
}

function isInReducedRowEchelonForm(matrix) {
  let numVariables = matrix[0].length - 1;
  if (numVariables > matrix.length) return false;

  for (let y = 0; y < numVariables; y++) {
    for (let x = 0; x < matrix[0].length - 1; x++) {
      if (x === y && matrix[y][x].toNumber() !== 1) return false;
      if (x !== y && matrix[y][x].toNumber() !== 0) return false;
    }
  }

  return true;
}

module.exports = { partOne, partTwo };