const fs = require("fs");
const path = require("path");

const { runInstructions } = require("../common/intcode-compiler");

const OBJECTS = {
  WALL: 0,
  EMPTY: 1,
  O2: 2,
};

const DIRECTION = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
};

const OBJECTS_ASCII = {
  0: " ",
  1: "#",
  2: ".",
  3: "!"
}

function printMap(map, pos) {
  let mapString = "";

  let values = Object.keys(map).map(key => {
    let [_, y, x] = key.match(/(.*),(.*)/);

    return [Number(y), Number(x)];
  });

  let minX = values.reduce((acc, val) => Math.min(acc, val[0]), +Infinity);
  let maxX = values.reduce((acc, val) => Math.max(acc, val[0]), -Infinity);
  let minY = values.reduce((acc, val) => Math.min(acc, val[1]), +Infinity);
  let maxY = values.reduce((acc, val) => Math.max(acc, val[1]), -Infinity);

  for (let y = maxY + 1; y >= minY - 1; y--) {
    for (let x = minX - 1; x <= maxX + 1; x++) {
      if (x == pos[0] && y == pos[1]) mapString += "D";
      else mapString += OBJECTS_ASCII[(map[[x,y]] || OBJECTS.UNKNOWN)];
    }
    mapString += "\n";
  }

  console.log(mapString);
}

function stringifyPos(x, y) {
  return x + "," + y;
}

const NEIGHBORS = [[-1,0],[1,0],[0,-1],[0,1]];

// Fill out the map so that all empty spaces become the distance from 0
function bfs(map) {
  let safeGet = (x, y) => {
    if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return undefined;
    else if (map[y][x] === "." || map[y][x] === " ") return undefined;
    else return map[y][x];
  }

  while (true) {
    let nextMap = [];
    let anyChanged = false;

    for (let y = 0; y < map.length; y++) {
      let row = [];
      for (let x = 0; x < map[0].length; x++) {
        if (map[y][x] !== " ") {
          row.push(map[y][x]);
          continue;
        }

        let neighbors = NEIGHBORS.map(([dx, dy]) => safeGet(x + dx, y + dy))
          .filter(x => x != undefined);

        if (neighbors.length == 0) {
          row.push(map[y][x]);
          continue;
        }

        anyChanged = true;
        let max = neighbors.reduce((acc, n) => Math.max(acc, n), 0);
        row.push(max + 1);
      }

      nextMap.push(row);
    }

    map = nextMap;

    if (!anyChanged) return map;
  }
}

function findMaxBreadth(mapObj) {
  let values = Object.keys(mapObj).map(key => {
    let [_, y, x] = key.match(/(.*),(.*)/);

    return [Number(y), Number(x)];
  });

  let minX = values.reduce((acc, val) => Math.min(acc, val[0]), +Infinity);
  let maxX = values.reduce((acc, val) => Math.max(acc, val[0]), -Infinity);
  let minY = values.reduce((acc, val) => Math.min(acc, val[1]), +Infinity);
  let maxY = values.reduce((acc, val) => Math.max(acc, val[1]), -Infinity);

  let map = [];

  for (let y = maxY; y >= minY; y--) {
    let row = [];
    for (let x = minX; x <= maxX; x++) {
      if (mapObj[[x,y]] == OBJECTS.O2) row.push(0);
      else if (mapObj[[x,y]] != OBJECTS.WALL) row.push(" ");
      else row.push(".");
    }
    map.push(row);
  }

  map = bfs(map);

  let max = map.reduce((acc, row) => 
      Math.max(acc, row.reduce((rowAcc, n) => !isNaN(n) ? Math.max(rowAcc, n) : rowAcc, 0)), 
    0);
  console.log(`Part two answer: ${max}`);

  return;
}

function runRobot(instrs) {
  let visited = new Set();
  let pos = [0,0];
  let map = {};
  map[pos] = OBJECTS.EMPTY;

  let lastCommand;
  let dfs = [];

  let getInput = () => {
    let nextCommand;

    if (!visited.has(stringifyPos(pos[0], pos[1] + 1))) nextCommand = DIRECTION.NORTH;
    else if (!visited.has(stringifyPos(pos[0], pos[1] - 1))) nextCommand = DIRECTION.SOUTH;
    else if (!visited.has(stringifyPos(pos[0] + 1, pos[1]))) nextCommand = DIRECTION.EAST;
    else if (!visited.has(stringifyPos(pos[0] - 1, pos[1]))) nextCommand = DIRECTION.WEST;
    
    // If no moves are valid and the search queue is empty, then DFS has completely searched
    if (nextCommand == undefined && dfs.length == 0) {
      findMaxBreadth(map);
      // Exiting the process to kill the IntCode machine as well
      process.exit();
    }

    // Otherwise, go back one space in the DFS search
    if (nextCommand == undefined) {
      
      nextCommand = dfs.pop();
      switch (nextCommand) {
        case DIRECTION.NORTH:
          nextCommand = DIRECTION.SOUTH;
          break;
        case DIRECTION.SOUTH:
          nextCommand = DIRECTION.NORTH;
          break;
        case DIRECTION.WEST:
          nextCommand = DIRECTION.EAST;
          break;
        case DIRECTION.EAST:
          nextCommand = DIRECTION.WEST;
          break;
      }
    } else {
      dfs.push(nextCommand);
    }

    lastCommand = nextCommand;

    return nextCommand;
  }

  let output = (status) => {
    if (status == OBJECTS.WALL) {
      let wallPos = [pos[0], pos[1]];

      switch (lastCommand) {
        case DIRECTION.NORTH:
          wallPos[1]++;
          break;
        case DIRECTION.SOUTH:
          wallPos[1]--;
          break;
        case DIRECTION.WEST:
          wallPos[0]--;
          break;
        case DIRECTION.EAST:
          wallPos[0]++;
          break;
      }

      visited.add(stringifyPos(wallPos[0], wallPos[1]));
      map[wallPos] = OBJECTS.WALL;
      // The last command didn't succeed, so remove it from the DFS queue
      dfs.pop();
    }

    if (status == OBJECTS.EMPTY || status == OBJECTS.O2) {
      switch (lastCommand) {
        case DIRECTION.NORTH:
          pos[1]++;
          break;
        case DIRECTION.SOUTH:
          pos[1]--;
          break;
        case DIRECTION.WEST:
          pos[0]--;
          break;
        case DIRECTION.EAST:
          pos[0]++;
          break;
      }

      visited.add(stringifyPos(pos[0], pos[1]));
      map[pos] = OBJECTS.EMPTY;
    }

    if (status == OBJECTS.O2) {
      console.log(`Part one answer: ${dfs.length}`);
      map[pos] = OBJECTS.O2;
    }

    return;
  }

  runInstructions(instrs, getInput, output);

  return;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let instrs = input[0].trim().split(',');

  runRobot(instrs);
}

module.exports = { main };