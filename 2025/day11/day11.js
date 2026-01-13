const _ = require('../../util/utils.js');

// the test inputs between parts one and two are different, so input_example.txt is part two
const partOneTestInput = [
'aaa: you hhh',
'you: bbb ccc',
'bbb: ddd eee',
'ccc: ddd eee fff',
'ddd: ggg',
'eee: out',
'fff: out',
'ggg: out',
'hhh: ccc fff iii',
'iii: out'
];

function partOne(inputs, testMode) {
  let graph = parseGraph(testMode ? partOneTestInput : inputs);

  let frontier = ['you'];
  let numPaths = 0;
  while (frontier.length > 0) {
    let node = frontier.shift();

    if (node === 'out') {
      numPaths++
      continue;
    }

    for (let adj of graph[node]) frontier.push(adj);
  }

  return numPaths;
}

function parseGraph(inputs) {
  let graph = {};
  for (let input of inputs) {
    let [match, start, ends] = input.match(/(.*): (.*)/);
    ends = ends.split(' ');
    graph[start] = ends;
  }

  return graph;
}

function partTwo(inputs, testMode) {
  let graph = parseGraph(inputs);
  return findNumSolutions(graph, 'svr', false, false);
}

function uncachedFindNumSolutions(graph, node, hitDac, hitFft) {
  if (node === 'out' && hitDac && hitFft) return 1;
  else if (node === 'out') return 0;

  hitDac = hitDac || node === 'dac';
  hitFft = hitFft || node === 'fft';

  let numSolutions = 0;
  for (let adj of graph[node]) {
    numSolutions += findNumSolutions(graph, adj, hitDac, hitFft);
  }

  return numSolutions;
}

let numSolutionsCache = {};
let findNumSolutions = (graph, node, hitDac, hitFft) => 
  _.cachedFunction(uncachedFindNumSolutions, 
      (graph, node, hitDac, hitFft) => `${node},${hitDac},${hitFft}`, 
      numSolutionsCache, graph, node, hitDac, hitFft);

module.exports = { partOne, partTwo };