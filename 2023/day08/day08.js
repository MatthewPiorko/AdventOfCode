const _ = require('../../util/utils.js');

function parseGraph(inputs) {
  let graph = {};
  for (let input of inputs) {
    let [_, node, left, right] = input.match(/(\w+) = \((\w+), (\w+)\)/);

    graph[node] = [left, right];
  }

  return graph;
}

function findDistanceToEnd(start, instructions, graph, endNodes) {
  let count = 0, idx = 0, current = start;

  while (count < 100000) {
    if (instructions[idx] === 'L') current = graph[current][0];
    else current = graph[current][1];

    idx = (idx + 1) % (instructions.length);
    count++;

    if (endNodes.has(current)) return count;
  }
}

let partOne = (inputs, testMode) => findDistanceToEnd("AAA", inputs[0], parseGraph(inputs.slice(2)), new Set(["ZZZ"]));

function partTwo(inputs, testMode) {
  let graph = parseGraph(inputs.slice(2));
  let currentNodes = Object.keys(graph).filter(node => node.endsWith('A'));
  let endNodes = Object.keys(graph).filter(node => node.endsWith('Z'));

  // each ghost has some repeating loop when it reaches the goal
  // the time when all ghosts will be at their goal is the LCM of all their loop lengths
  return currentNodes.map(start => findDistanceToEnd(start, inputs[0], graph, new Set(endNodes)))
                     .reduce((acc, loopLength) => _.lcm(acc, loopLength), 1);
}

module.exports = { partOne, partTwo };