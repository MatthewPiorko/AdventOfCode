const _ = require('../../util/utils.js');

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

// find the furthest pipe (for part one), and all visited pipes (for part two)
function exploreGraph(inputs) {
  let grid = inputs.map(row => row.split(""));
  let start = find2D(grid, "S");

  let frontier = [[start, 0]], visited = new Set();
  let furthest = -Infinity;

  // do a BFS from the start to all nodes
  while (frontier.length > 0) {
    let [position, dist] = frontier.shift();
    if (visited.has(position.toString())) continue;

    furthest = Math.max(furthest, dist);
    frontier.push(...findAdjacentPipes(grid, position.x, position.y).map(adj => [adj, dist + 1]));

    visited.add(position.toString());
  }

  return [furthest, visited];
}

let partOne = (inputs, testMode) => exploreGraph(inputs)[0];

function find2D(grid, target) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === target) return new Position(x, y);
    }
  }
}

const NORTH_CONNECTORS = new Set(["|", "L", "J", "S"]);
const EAST_CONNECTORS = new Set(["-", "L", "F", "S"]);
const SOUTH_CONNECTORS = new Set(["|", "7", "F", "S"]);
const WEST_CONNECTORS = new Set(["-", "J", "7", "S"]);

function findAdjacentPipes(grid, x, y) {
  let adj = [];

  if (NORTH_CONNECTORS.has(grid[y][x]) && SOUTH_CONNECTORS.has(_.safeGet2D(grid, x, y - 1))) adj.push(new Position(x, y - 1));
  if (EAST_CONNECTORS.has(grid[y][x]) && WEST_CONNECTORS.has(_.safeGet2D(grid, x + 1, y))) adj.push(new Position(x + 1, y));
  if (SOUTH_CONNECTORS.has(grid[y][x]) && NORTH_CONNECTORS.has(_.safeGet2D(grid, x, y + 1))) adj.push(new Position(x, y + 1));
  if (WEST_CONNECTORS.has(grid[y][x]) && EAST_CONNECTORS.has(_.safeGet2D(grid, x - 1, y))) adj.push(new Position(x - 1, y));

  return adj;
}

const OBJECTS = {
  EMPTY: ".",
  OPEN_EMPTY: "O"
};

// vertex (x, y) is in the upper left of position (x, y)
const VERTEX_ADJACENCY = [[0,0], [-1,0], [0,-1], [-1,-1]];

function partTwo(inputs, testMode) {
  let grid = inputs.map(row => row.split(""));

  // replace unused pipes with empty
  let [furthest, visited] = exploreGraph(inputs);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!visited.has(`${x},${y}`)) grid[y][x] = OBJECTS.EMPTY;
    }
  }

  // to "squeeze" through pipes, do a BFS on all vertices starting from the edges
  let vertexFrontier = [];
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][0] === OBJECTS.EMPTY) vertexFrontier.push(new Position(0, y));
    if (grid[y].at(-1) === OBJECTS.EMPTY) vertexFrontier.push(new Position(grid[y].length - 1, y));
  }
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[0][x] === OBJECTS.EMPTY) vertexFrontier.push(new Position(x, 0));
    if (grid[grid.length - 1][x] === OBJECTS.EMPTY) vertexFrontier.push(new Position(x, grid.length - 1));
  }

  let visitedVertices = new Set();
  while (vertexFrontier.length > 0) {
    let position = vertexFrontier.shift(), x = position.x, y = position.y;
    if (visitedVertices.has(position.toString())) continue;

    // any nodes adjacent to a vertex are open
    for (let [dx, dy] of VERTEX_ADJACENCY) {
      if (_.safeGet2D(grid, x + dx, y + dy) === OBJECTS.EMPTY) grid[y + dy][x + dx] = OBJECTS.OPEN_EMPTY;  
    }
    
    vertexFrontier.push(...findAdjacentVertices(grid, x, y));
    visitedVertices.add(position.toString());
  }

  return _.sum(grid.map(row => row.filter(v => v === OBJECTS.EMPTY).length));
}

function findAdjacentVertices(grid, x, y) {
  let adj = [];

  if (x < grid[0].length - 1 && !NORTH_CONNECTORS.has(grid[y][x])) adj.push(new Position(x + 1, y));
  if (x > 0 && !SOUTH_CONNECTORS.has(_.safeGet2D(grid, x - 1, y - 1))) adj.push(new Position(x - 1, y));
  if (y > 0 && !EAST_CONNECTORS.has(_.safeGet2D(grid, x - 1, y - 1))) adj.push(new Position(x, y - 1));
  if (y < grid.length - 1 && !WEST_CONNECTORS.has(grid[y][x])) adj.push(new Position(x, y + 1));

  return adj;
}

module.exports = { partOne, partTwo };