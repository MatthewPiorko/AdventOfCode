const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// Either a node with left and right nodes, or a number
class Node {
  constructor(left, right, number = undefined) {
    this.left = left;
    this.right = right;
    this.number = number;
    this.nodeType = (number !== undefined ? 'number' : 'node');

    if (left !== undefined) left.parent = this;
    if (right !== undefined) right.parent = this;
  }

  toString() {
    if (this.nodeType === 'number') return this.number;
    else return `[${this.left.toString()},${this.right.toString()}]`;
  }
}

function numberNode(num) {
  return new Node(undefined, undefined, num);
}

// Find the center "," in a string of input like "[[1,2],3]"
function findMiddle(input) {
  let numParen = 0;

  for (let idx = 1; idx < input.length; idx++) {
    if (input[idx] === '[') numParen++;
    if (input[idx] === ']') numParen--;
    if (input[idx] === ',' && numParen === 0) return idx;
  }

  return undefined;
}

// Parse [(.*),(.*)] to a node recursively
function parseSnail(input) {
  let middle = findMiddle(input);
  let left = input.slice(1, middle);
  let right = input.slice(middle + 1, input.length - 1);

  if (left.length > 1) left = parseSnail(left);
  else left = numberNode(Number(left[0]));

  if (right.length > 1) right = parseSnail(right);
  else right = numberNode(Number(right[0]));

  return new Node(left, right);
}

// Search for the right neighbor of a node, by climbing the tree until the right node isn't the current one
function findRightNeighbor(node) {
  let previous = node;
  
  while (node.parent !== undefined && node.parent.right === previous) {
    node = node.parent;
    previous = node;
  }

  if (node.parent === undefined) return undefined; // This is the right-most node in the tree
  node = node.parent.right;

  while (node.nodeType === 'node') node = node.left;
  return node;
}

// Search for the left neighbor of a node, by climbing the tree until the left node isn't the current one
function findLeftNeighbor(node) {
  let previous = node;

  while (node.parent !== undefined && node.parent.left === previous) {
    node = node.parent;
    previous = node;
  }

  if (node.parent === undefined) return undefined; // This is the left-most node in the tree
  node = node.parent.left;

  while (node.nodeType === 'node') node = node.right;
  return node;
}

function add(snail1, snail2) {
  return new Node(snail1, snail2);
}

// Explode a number's left component to it's left neighbor, and right component to it's right neighbor
function explodeNode(node) {
  let leftExploded = node.left.number;
  let rightExploded = node.right.number;

  let leftNeighbor = findLeftNeighbor(node);
  let rightNeighbor = findRightNeighbor(node);

  if (rightNeighbor !== undefined) rightNeighbor.number = rightNeighbor.number + rightExploded;
  if (leftNeighbor !== undefined) leftNeighbor.number = leftNeighbor.number + leftExploded;
}

// Check for explosions, and handle the first one (if any)
function handleExplosions(input, depth = 1) {
  if (input.nodeType === 'number') return [input, false];

  if (depth >= 4 && input.left.nodeType === 'node') {
    explodeNode(input.left);
    return [new Node(numberNode(0), input.right), true];
  }
  else if (depth >= 4 && input.right.nodeType === 'node') {
    explodeNode(input.right);
    return [new Node(input.left, numberNode(0)), true];
  }

  let [newLeft, leftExploded] = handleExplosions(input.left, depth + 1);
  if (leftExploded) return [new Node(newLeft, input.right), true];

  let [newRight, rightExploded] = handleExplosions(input.right, depth + 1);
  return [new Node(newLeft, newRight), rightExploded];
}

// Check for splits, and handle the first one (if any)
function handleSplit(input) {
  if (input.nodeType === 'number' && input.number > 9) {
    let left = numberNode(Math.floor(input.number / 2));
    let right = numberNode(Math.ceil(input.number / 2));

    return [new Node(left, right), true];
  }
  else if (input.nodeType === 'number') {
    return [input, false];
  }
  else {
    let [newLeft, leftSplit] = handleSplit(input.left);
    if (leftSplit) return [new Node(newLeft, input.right), true];

    let [newRight, rightSplit] = handleSplit(input.right);
    return [new Node(newLeft, newRight), rightSplit];
  }
}

function reduceSnail(input) {
  let [explodedInput, didExplode] = handleExplosions(input);
  if (didExplode) return reduceSnail(explodedInput);

  let [splitInput, didSplit] = handleSplit(input);
  if (didSplit) return reduceSnail(splitInput);

  return input;
}

function magnitude(node) {
  if (node.nodeType === 'number') return node.number;
  return magnitude(node.left) * 3 + magnitude(node.right) * 2;
}

function partOne(inputs) {
  return magnitude(inputs.map(input => parseSnail(input.split('')))
      .reduce((snail, nextSnail) => reduceSnail(add(snail, nextSnail)));
}

function partTwo(inputs) {
  return _.max(_.range(0, inputs.length - 1).map(i =>
    _.max(_.range(0, inputs.length - 1).map(j => {
      if (i === j) return -Infinity;

      let snail1 = parseSnail(inputs[i].split(''));
      let snail2 = parseSnail(inputs[j].split(''));

      return magnitude(reduceSnail(add(snail1, snail2)));
  }))));
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };