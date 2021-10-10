const fs = require("fs");
const path = require("path");

const OBJECTS = {
  WALL: '#',
  FLOOR: '.',
  ENTRANCE: '@'
}

const ADJACENT_DIRECTIONS = [
  [-1,0], [1,0], [0,-1], [0,1]
];

function findObject(map, char) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === char) return [x, y];
    }
  }
}

function findEntrance(map) {
  return findObject(map, OBJECTS.ENTRANCE);
}

function safeGet(map, x, y) {
  if (x < 0 || y < 0) return OBJECTS.WALL;
  if (y >= map.length || x >= map[0].length) return OBJECTS.WALL;

  return map[y][x];
}

function stringifyPos(pos) {
  return `${pos[0]},${pos[1]}`;
}

function isKey(char) {
  return char !== OBJECTS.WALL && char !== OBJECTS.FLOOR
    && char !== OBJECTS.ENTRANCE && char === char.toLowerCase();
}

function isDoor(char) {
  return char !== OBJECTS.WALL && char !== OBJECTS.FLOOR
    && char !== OBJECTS.ENTRANCE && char === char.toUpperCase();
}

function printMap(map) {
  for (y in map) {
    let s = '';
    for (x in map[y]) {
      s += map[y][x] 
    }
    console.log(s);
  }
}

class SearchItem {
  constructor(x, y, requiredKeys) {
    this.x = x;
    this.y = y;
    this.requiredKeys = requiredKeys;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

// Return a map of key => keys required to obtain it 
function determineKeyRequirements(map) {
  let keyMap = {};
  let visited = new Set();
  let entrancePos = findEntrance(map);

  let frontier = [new SearchItem(entrancePos[0], entrancePos[1], new Set())];

  while (frontier.length > 0) {
    let item = frontier.shift();

    if (visited.has(item.toString())) continue;
    visited.add(item.toString());

    let char = map[item.y][item.x];
    let requiredKeys = new Set(item.requiredKeys);
    
    if (isKey(char)) keyMap[char] = item.requiredKeys;
    if (isDoor(char)) requiredKeys.add(char.toLowerCase());

    for (let [deltaX, deltaY] of ADJACENT_DIRECTIONS) {
      let spot = safeGet(map, item.x + deltaX, item.y + deltaY);

      if (visited.has(new SearchItem(item.x + deltaX, item.y + deltaY, requiredKeys).toString())) continue;
      if (spot === OBJECTS.WALL) continue;

      frontier.push(new SearchItem(item.x + deltaX, item.y + deltaY, requiredKeys));
    }
  }

  return keyMap;
}

class KeyDistance {
  constructor(x, y, distance) {
    this.x = x;
    this.y = y;
    this.distance = distance;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

function findAllKeys(map) {
  let keys = new Set();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let char = map[y][x];
      if (isKey(char)) keys.add(char);
    }
  }

  return keys;
}

let cache = {};

function determineCacheEntry(currentChars, keys) {
  let sortedKeys = Array.from(keys).sort();
  return `${currentChars.join(',')}/${sortedKeys.join(',')}`;
}

// Determine a path through the map recursively
// Given the list of current people or robots, it recursively checks each possible exploration path
// Return [best path (for debugging), best path cost]
function determinePath(currentChars, keys, totalNumKeys, keyDistances, keyRequirements) {
  // Path has been found
  if (keys.size === totalNumKeys) return ["", 0];

  // Use caching to prevent computing the same subproblem twice
  let cacheEntry = determineCacheEntry(currentChars, keys);
  if (cache[cacheEntry] !== undefined) return cache[cacheEntry];

  let bestDistance = Infinity;
  let bestPath = undefined;

  // The next key to pick up can be any obtainable one from any map
  let eligibleKeys = {};
  for (let i = 0; i < currentChars.length; i++) {
    let currentChar = currentChars[i];

    for (let key of Object.keys(keyDistances[i][currentChar])) {
      eligibleKeys[key] = keyDistances[i][currentChar];
    }
  }

  for (let key of Object.keys(eligibleKeys)) {
    // If we already have the key, we don't need it again
    if (keys.has(key)) continue;

    // If we don't have the keys to reach it, look for another way
    let hasRequiredKeys = Array.from(keyRequirements[key]).every(req => {
      return keys.has(req);
    });
    if (!hasRequiredKeys) continue;

    // Compute the distance to pick up the new key from any player or robot
    let distance = 0;
    let newChars = currentChars.map(char => char);
    for (let i = 0; i < currentChars.length; i++) {
      let currentChar = currentChars[i];

      if (keyDistances[i][currentChar][key] !== undefined) {
        distance += keyDistances[i][currentChar][key];
        newChars[i] = key;
      }
    }

    // Solve the sub-problems and use the best answer
    let subKeys = new Set(keys);
    subKeys.add(key);
    let [subPath, subPathCost] = determinePath(newChars, subKeys, totalNumKeys, keyDistances, keyRequirements);

    if (subPathCost + distance < bestDistance) {
      bestDistance = subPathCost + distance;
      bestPath = `${key},${subPath}`;
    }
  }

  cache[cacheEntry] = [bestPath, bestDistance];
  return [bestPath, bestDistance];
}

function determineKeyDistance(map, key) {
  let keyDistanceMap = {};
  let distanceMap = {};
  let startPos = findObject(map, key);
  if (startPos === undefined) return keyDistanceMap;

  let frontier = [new KeyDistance(startPos[0], startPos[1], -1)];

  while (frontier.length > 0) {
    let item = frontier.shift();
    let distance = item.distance + 1;

    if (distanceMap[item.toString()] !== undefined && distanceMap[item.toString()] <= distance) continue;
    distanceMap[item.toString()] = distance;

    let char = map[item.y][item.x];
    
    if (isKey(char)) keyDistanceMap[char] = distance;

    for (let [deltaX, deltaY] of ADJACENT_DIRECTIONS) {
      if (safeGet(map, item.x + deltaX, item.y + deltaY) !== OBJECTS.WALL) {
        frontier.push(new KeyDistance(item.x + deltaX, item.y + deltaY, distance));
      }
    }
  }

  delete keyDistanceMap[key];
  return keyDistanceMap;
}

function findBestPathThroughMaze(map) {
  // printMap(map);

  let keyRequirements = determineKeyRequirements(map);

  let keys = findAllKeys(map);
  let keyDistances = {};
  for (let key of keys) {
    keyDistances[key] = determineKeyDistance(map, key);
  }
  keyDistances[OBJECTS.ENTRANCE] = determineKeyDistance(map, OBJECTS.ENTRANCE);

  let pathAndCost = determinePath([OBJECTS.ENTRANCE], new Set(), keys.size, [keyDistances], keyRequirements);
  return pathAndCost[1];
}

function subMap(map, minX, maxX, minY, maxY) {
  return map.slice(minY, maxY).map(row => row.slice(minX, maxX));
}

const MAP_CORRECTION = [
  [[-1,-1], OBJECTS.ENTRANCE],
  [[0,-1], OBJECTS.WALL],
  [[1,-1], OBJECTS.ENTRANCE],
  [[-1,0], OBJECTS.WALL],
  [[0,0], OBJECTS.WALL],
  [[1,0], OBJECTS.WALL],
  [[-1,1], OBJECTS.ENTRANCE],
  [[0,1], OBJECTS.WALL],
  [[1,1], OBJECTS.ENTRANCE]
];

function findBestPathThroughCorrectedMaze(map) {
  let midY = Math.ceil(map.length / 2);
  let maxY = map.length;
  let midX = Math.ceil(map[0].length / 2);
  let maxX = map[0].length;

  // Fix the map by replacing the center with the appropriate objects
  for ([[deltaX, deltaY], correctChar] of MAP_CORRECTION) {
    map[midY + deltaY - 1][midX + deltaX - 1] = correctChar;
  }

  let upperLeft = subMap(map, 0, midX, 0, midY);
  let upperRight = subMap(map, midX - 1, maxX, 0, midY);
  let lowerLeft = subMap(map, 0, midX, midY - 1, maxY);
  let lowerRight = subMap(map, midX - 1, maxX, midY - 1, maxY);
  let subMaps = [upperLeft, upperRight, lowerLeft, lowerRight];

  let keys = findAllKeys(map);
  let keyDistances = [];
  for (let subMap of subMaps) {
    let subKeyDistances = {};
    for (let key of keys) {
      subKeyDistances[key] = determineKeyDistance(subMap, key);
    }
    subKeyDistances[OBJECTS.ENTRANCE] = determineKeyDistance(subMap, OBJECTS.ENTRANCE);  
    keyDistances.push(subKeyDistances);
  }

  let totalRequirements = subMaps.map(determineKeyRequirements).reduce((acc, keyRequirements) => {
    for (let key of Object.keys(keyRequirements)) {
      acc[key] = keyRequirements[key];
    }
    return acc;
  }, {});

  let startingPos = subMaps.map(subMap => OBJECTS.ENTRANCE);
  let pathAndCost = determinePath(startingPos, new Set(), keys.size, keyDistances, totalRequirements);

  return pathAndCost[1];
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  input = input.map(row => row.split(''));

  console.log(`Part one answer: ${findBestPathThroughMaze(input)}`);
  console.log(`Part two answer: ${findBestPathThroughCorrectedMaze(input)}`);
}

module.exports = { main };