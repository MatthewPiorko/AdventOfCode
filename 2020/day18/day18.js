const fs = require("fs");
const path = require("path");

class Value {
  constructor(value) {
    this.value = value;
  }
}

class Operation {
  constructor(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
}

// Find the index that a subexpression ends
function findSubExpr(input, idx, dir = -1) {
  if (input[idx].match(/\d/)) return idx;

  let numParens = 0;

  while (idx >= 0 && idx <= input.length) {
    let char = input[idx];

    if (char == "(") {
      numParens++;
    } else if (char == ")") {
      numParens--;
    }

    if (numParens == 0) return idx;

    idx += dir;
  }
}

// Turn an expression string into a list of character tokens
function tokenize(expr) {
  return expr.split("").filter(str => str != " ").reverse();
}

// Parse a list of characters into a tree of expressions
function parse(input) {
  if (input.length == 1) return new Value(Number(input[0]));

  if (input[0] == ")" || input[0] == "(") {
    let endIdx = findSubExpr(input, 0, 1);
    let subExpr = input.slice(1, endIdx);
    let left = parse(subExpr);

    if (endIdx >= input.length - 1) return left;

    let rest = input.slice(endIdx + 1);

    return new Operation(left, rest[0], parse(rest.slice(1)));
  } else {
    return new Operation(new Value(Number(input[0])), input[1], parse(input.slice(2)));
  }
}

// Evaluate a tree of expressions to a single number
function evaluate(result) {
  if (result instanceof Value) return result.value;

  if (result instanceof Operation) {
    if (result.op == "+") return evaluate(result.left) + evaluate(result.right);
    else return evaluate(result.left) * evaluate(result.right);
  }
}

// Add parenthesis around each + operation, to give + precedence over *
function addParens(input) {
  let mostRecentIdx = 0;

  let totalPluses = input.reduce((acc, char) => acc + (char == '+'), 0);
  for (let i = 0; i < totalPluses; i++) {
    let idx = input.indexOf("+", mostRecentIdx + 1);

    let startIdx = findSubExpr(input, idx - 1, -1);
    let endIdx = findSubExpr(input, idx + 1, +1);

    let beginning = input.slice(0, startIdx);
    let left = input.slice(startIdx, idx);
    let right = input.slice(idx + 1, endIdx + 1);
    let end = input.slice(endIdx + 1);

    input = [...beginning, 
      ')', 
      ...left, 
      '+', 
      ...right, 
      '(', 
      ...end];

    mostRecentIdx = idx + 1;
  }

  return input;
}

function evaluteNoOrder(input) {
  return input.map(tokenize).map(parse).map(evaluate).reduce((acc, val) => acc + val, 0);
}

function evaluateAddBeforeMul(input) {
  return input.map(tokenize).map(addParens).map(parse).map(evaluate).reduce((acc, val) => acc + val, 0);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${evaluteNoOrder(input)}`);
  console.log(`Part two answer: ${evaluateAddBeforeMul(input)}`);
}

module.exports = { main };