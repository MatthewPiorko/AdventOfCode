const fs = require("fs");
const path = require("path");

class Node {
  constructor(children, metadata, size) {
    this.children = children;
    this.metadata = metadata;
    this.size = size;
  }

  sumMetadata() {
    return this.metadata.reduce((acc, metadata) => acc + metadata, 0);
  }
}

// Parse the first node found in the sequence of inputs
function parseNode(inputs) {
  let numChildren = inputs[0];
  let numMetadata = inputs[1];
  let children = [];

  let currentIdx = 2;
  while (children.length < numChildren) {
    let child = parseNode(inputs.slice(currentIdx));
    children.push(child);
    currentIdx += child.size;
  }

  return new Node(children, inputs.slice(currentIdx, currentIdx + numMetadata), currentIdx + numMetadata);
}

function sumAllMetadata(node) {
  return node.sumMetadata() + node.children
    .map(child => sumAllMetadata(child))
    .reduce((acc, metadata) => acc + metadata, 0);
}

function partOne(input) {
  input = input[0].split(' ').map(Number);
  let tree = parseNode(input);
  return sumAllMetadata(tree);
}

function calculateValue(node) {
  if (node.children.length === 0) return node.sumMetadata();

  return node.metadata.reduce((acc, metadata) => {
    // Metadata is 1-indexed
    let child = node.children[metadata - 1];
    return acc + (child !== undefined ? calculateValue(node.children[metadata - 1]) : 0);
  }, 0);
}

function partTwo(input) {
  input = input[0].split(' ').map(Number);
  let tree = parseNode(input);
  return calculateValue(tree);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };