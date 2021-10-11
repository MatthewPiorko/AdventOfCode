const fs = require("fs");
const path = require("path");

const OBJECTS = {
  WALL: '#',
  FLOOR: '.',
  SPACE: ' '
}

function safeGet(map, x, y) {
  if (x < 0 || y < 0) return OBJECTS.SPACE;
  if (y >= map.length || x >= map[0].length) return OBJECTS.SPACE;

  return map[y][x];
}

function isPortal(char) {
  return char !== OBJECTS.WALL && char !== OBJECTS.FLOOR && char !== OBJECTS.SPACE;
}

const ADJACENT = [
  [-1, 0, true],
  [1, 0, false],
  [0, -1, true],
  [0, 1, false]
];

function isOutside(map, x, y) {
  let maxY = map.length, maxX = map[0].length;
  return x <= 3 || y <= 3 || x >= maxX - 3 || y >= maxY - 3;
}

function determinePortalLocations(map) {
  let portals = {};

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let char = map[y][x];
      if (!isPortal(char)) continue;

      // console.log(`Checking ${char} at ${x}, ${y}`);
      for (let [deltaX, deltaY] of ADJACENT) {
          let nextChar = safeGet(map, x + deltaX, y + deltaY, portals);
          let previousChar = safeGet(map, x - deltaX, y - deltaY, portals);

          if (isPortal(previousChar) && nextChar === OBJECTS.FLOOR) {
            let entry = [previousChar, char].sort();
            if (isOutside(map, x, y)) entry = entry.reverse();
            entry = entry.join('');

            if (portals[entry] === undefined) portals[entry] = [];
            portals[entry].push([x + deltaX, y + deltaY]);
          }
      }
    }
  }

  return portals;
}

class BfsPosition {
  constructor(currentChar, distance) {
    this.currentChar = currentChar;
    this.distance = distance;
  }

  toString() {
    return this.currentChar;
  }
}

const MAX_DISTANCE = 10000;

function bfs(map, portalsMap) {
  let visited = {};
  let frontier = [new BfsPosition('AA', 0)];

  while (frontier.length > 0) {
    let position = frontier.shift();

    // Already visited with a better path
    if (visited[position.toString()] < position.distance) continue;

    // Already visited the goal with a better path
    if (visited[`ZZ`] < position.distance) continue;

    // Maximum distance to search to avoid infinite recursion
    if (position.distance > MAX_DISTANCE) continue;

    visited[position.toString()] = position.distance - 1;

    if (position.currentChar == 'ZZ') continue;

    for (let portal of Object.keys(portalsMap[position.currentChar])) {
      let distance = position.distance + portalsMap[position.currentChar][portal] + 1;
      frontier.push(new BfsPosition(portal.split('').reverse().join(''), distance));
    }
  }

  return visited[`ZZ`];
}

class RecursivePosition {
  constructor(currentChar, recursionLevel, distance) {
    this.currentChar = currentChar;
    this.recursionLevel = recursionLevel;
    this.distance = distance;
  }

  toVisitedEntry() {
    return `${this.currentChar},${this.recursionLevel}`;
  }
}

function recursiveBfs(map, portalsMap) {
  let visited = {};
  let frontier = [new RecursivePosition('AA', 0, 0)];

  while (frontier.length > 0) {
    let position = frontier.shift();

    // Already visited this space with a better path
    if (visited[position.toVisitedEntry()] < position.distance) continue;

    // Already visited the goal with a better path
    if (visited[`ZZ,0`] < position.distance) continue;

    // Maximum distance to search to avoid infinite recursion
    if (position.distance > MAX_DISTANCE) continue;

    visited[position.toVisitedEntry()] = position.distance;

    // Found the exit! Return the distance (minus the last step that wasn't needed)
    if (position.currentChar === 'ZZ') return position.distance - 1;

    for (let portal of Object.keys(portalsMap[position.currentChar])) {
      if (portal === 'ZZ' && position.recursionLevel > 0) continue;

      let distance = position.distance + portalsMap[position.currentChar][portal] + 1;
      let recursingInward = portal === portal.split('').sort().join('');

      if (recursingInward) {
        frontier.push(new RecursivePosition(portal.split('').reverse().join(''), position.recursionLevel + 1, distance));
      } else if (!recursingInward && position.recursionLevel > 0) {
        frontier.push(new RecursivePosition(portal.split('').reverse().join(''), position.recursionLevel - 1, distance));
      }
    }
  }

  return visited[`ZZ,0`];
}

class SearchPosition {
  constructor(x, y, distance) {
    this.x = x;
    this.y = y;
    this.distance = distance;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

// Run bfs from the start position to find all other portals
function findDistances(map, startX, startY) {
  let exits = {};
  let visited = {};
  let frontier = [new SearchPosition(startX, startY, 0)];

  while (frontier.length > 0) {
    let position = frontier.shift();

    // Already visited position
    if (visited[position.toString()] !== undefined) continue;
    visited[position.toString()] = position.distance;

    for (let [deltaX, deltaY, shouldFlip] of ADJACENT) {
      let char = safeGet(map, position.x + deltaX, position.y + deltaY);

      if (char === OBJECTS.FLOOR) {
        frontier.push(new SearchPosition(position.x + deltaX, position.y + deltaY, position.distance + 1));
      }

      if (isPortal(char) && position.distance > 0) {
        let otherChar = safeGet(map, position.x + deltaX + deltaX, position.y + deltaY + deltaY);
        let entry = [char, otherChar].sort();
        if (isOutside(map, position.x + deltaX, position.y + deltaY)) entry = entry.reverse();
        entry = entry.join('');

        // Nothing can return to AA
        if (entry === 'AA') continue;

        exits[entry] = position.distance;
      }
    }
  }

  delete exits[safeGet(map, startX, startY)];
  return exits;
}

function determinePortalsMap(map) {
  let portalLocs = determinePortalLocations(map);
  let portalsMap = {
    'AA': portalLocs['AA'][0],
    'ZZ': portalLocs['ZZ'][0]
  };

  for (let portalName of Object.keys(portalLocs)) {
    for (let [x, y] of portalLocs[portalName]) {
      let distances = findDistances(map, x, y);

      portalsMap[portalName] = distances;
    }
  }

  return portalsMap;
}

function partOne(map) {
  return bfs(map, determinePortalsMap(map));
}

function partTwo(map) {
  return recursiveBfs(map, determinePortalsMap(map));
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  input = input.map(line => line.split(''));

  console.log(`Part one answer: ${partOne(input)}`);
  console.log(`Part two answer: ${partTwo(input)}`);
}

module.exports = { main };