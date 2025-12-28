const _ = require('../../util/utils.js');

class Point {
  constructor(str) {
    let [match, x, y, z] = str.match(/(\d+),(\d+),(\d+)/);

    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }

  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
}

function parseInput(inputs) {
  let points = inputs.map(row => new Point(row));

  let pairs = [];
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      pairs.push([points[i], points[j], distance(points[i], points[j])]);
    }
  }

  pairs.sort((pair1, pair2) => pair1[2] - pair2[2]);

  return [points, pairs];
}

function partOne(inputs, testMode) {
  let [points, pairs] = parseInput(inputs);

  let numConnections = testMode ? 10 : 1000;
  let maxConnectionIndex = numConnections - 1;
  let graph = createGraph(points, pairs, maxConnectionIndex);

  let distinctSizes = distinctSubgraphSizes(graph);
  distinctSizes.sort((a, b) => b - a);

  return _.product(distinctSizes.slice(0, 3));
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2) + Math.pow((p2.z - p1.z), 2));
}

function createGraph(points, pairs, maxConnectionIndex) {
  let graph = {};
  for (let point of points) {
    graph[point] = [];
  }

  for (let i = 0; i <= maxConnectionIndex; i++) {
    let [point1, point2, dist] = pairs[i];
    graph[point1].push(point2);
    graph[point2].push(point1);
  }

  return graph;
}

// break a disconnected graph into disjoint sub graphs by size
function distinctSubgraphSizes(graph) {
  let subgraphSizes = [];
  let visited = new Set();

  for (let node of Object.keys(graph)) {
    if (visited.has(node.toString())) continue;

    let subgraphNodes = reachableNodes(graph, node);
    subgraphSizes.push(subgraphNodes.size);
    visited = visited.union(subgraphNodes);
  }

  return subgraphSizes;
}

function reachableNodes(graph, start) {
  let visited = new Set();
  let frontier = [start];

  while (frontier.length > 0) {
    let node = frontier.pop();

    if (visited.has(node.toString())) continue;
    visited.add(node.toString());

    for (let adjacent of graph[node]) frontier.push(adjacent);
  }

  return visited;
}

function partTwo(inputs, testMode) {
  let [points, pairs] = parseInput(inputs);

  let isGraphConnected = (index) => {
    let graph = createGraph(points, pairs, index);
    return isFullyConnected(graph);
  };

  let workingIndex = _.binarySearch(0, pairs.length, isGraphConnected);
  return pairs[workingIndex][0].x * pairs[workingIndex][1].x;
}

function isFullyConnected(graph) {
  let visited = new Set();
  let frontier = [Object.keys(graph)[0]];

  while (frontier.length > 0) {
    let node = frontier.pop();

    if (visited.has(node.toString())) continue;
    visited.add(node.toString());

    for (let adjacent of graph[node]) frontier.push(adjacent);
  }

  return visited.size === Object.keys(graph).length;
}

module.exports = { partOne, partTwo };