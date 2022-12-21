const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function parseMonkeys(inputs) {
  let monkeys = {};

  for (let input of inputs) {
    let [_, monkey, yell] = input.match(/(\w+): (.*)/);
    yell = yell.split(' ');

    if (yell.length === 1) {
      monkeys[monkey] = Number(yell[0]);
    } else {
      let [left, op, right] = yell;
      monkeys[monkey] = [left, op, right];
    }
  }

  return monkeys;
}

// substitute monkey's strings with their values as much as possible
function performSubstitutions(monkeys) {
  while (true) {
    let numSubstitutions = 0;

    for (let monkey of Object.keys(monkeys)) {
      if (typeof(monkeys[monkey]) === 'number') continue;

      let [left, op, right] = monkeys[monkey];
      // cannot substitute this value unless both left & right have a value
      if (typeof(monkeys[left]) !== 'number' || typeof(monkeys[right]) !== 'number') continue;

      if (op === '+') monkeys[monkey] = monkeys[left] + monkeys[right];
      if (op === '-') monkeys[monkey] = monkeys[left] - monkeys[right];
      if (op === '*') monkeys[monkey] = monkeys[left] * monkeys[right];
      if (op === '/') monkeys[monkey] = monkeys[left] / monkeys[right];
      numSubstitutions++;
    }

    if (numSubstitutions === 0) return monkeys;
  }
}

function partOne(inputs, testMode) {
  let monkeys = parseMonkeys(inputs);
  performSubstitutions(monkeys);

  return monkeys['root'];
}

// each node is either a number, 'humn', or a tree
class EquationTree {
  constructor(left, op, right, containsHuman) {
    this.left = left;
    this.op = op;
    this.right = right;
    this.containsHuman = containsHuman;
  }

  toString() {
    return `(${this.left.toString()} ${this.op} ${this.right.toString()})`;
  }
}

// parse a map of monkey -> func into a tree of functions
function parseTree(monkeys, start) {
  if (start === 'humn') return start;
  if (typeof(monkeys[start]) === 'number') return monkeys[start];

  let [left, op, right] = monkeys[start];

  let leftTree = parseTree(monkeys, left);
  let rightTree = parseTree(monkeys, right);

  let containsHuman = leftTree === 'humn' || rightTree === 'humn' || (typeof(leftTree) === 'object' && leftTree.containsHuman) || (typeof(rightTree) === 'object' && rightTree.containsHuman);

  return new EquationTree(leftTree, op, rightTree, containsHuman);
}

// solve (5 * (humn - 2)) = 30 for humn, and return 8
function solveForHuman(tree, value) {
  if (typeof(tree) === 'number') return tree;
  if (tree === 'humn') return value;

  let parsableTree, subtreeValue;
  // solve the tree that doesn't contain humn
  if ((typeof(tree.left) === 'object' && tree.left.containsHuman) || tree.left === 'humn') {
    subtreeValue = solveForHuman(tree.right, value);
    parsableTree = tree.left;
  } else {
    subtreeValue = solveForHuman(tree.left, value);
    parsableTree = tree.right;
  }

  // reverse the operation and continue solving for x
  if (tree.op === '+') return solveForHuman(parsableTree, value - subtreeValue);
  if (tree.op === '-') return solveForHuman(parsableTree, value + subtreeValue);
  if (tree.op === '*') return solveForHuman(parsableTree, value / subtreeValue);
  if (tree.op === '/') return solveForHuman(parsableTree, value * subtreeValue);
}

function partTwo(inputs, testMode) {
  let monkeys = parseMonkeys(inputs);

  delete monkeys['humn'];
  monkeys['root'][1] = '=';

  // substitute as much as possible
  performSubstitutions(monkeys);

  // solve for left = right, i.e. right - left = 0 (or left - right = 0)
  let [left, _, right] = monkeys['root'];
  if (typeof(monkeys[left]) === 'number') {
    let tree = parseTree(monkeys, right, 0);
    return solveForHuman(tree, monkeys[left] * -1);
  }
  else {;
    let tree = parseTree(monkeys, left, 0);
    return solveForHuman(tree, monkeys[right] * -1);
  }
}

function main(file, testMode) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs, testMode)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs, testMode)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };