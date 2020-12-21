const fs = require("fs");
const path = require("path");

const gcdCache = {};

function gcd(a, b) {
  if (gcdCache[[a,b]] != undefined) return gcdCache[[a,b]];
  if (b == 0) { gcdCache[[a,b]] = a; return a; }

  let result = gcd(b, a % b);

  gcdCache[[a,b]] = result;

  return result;
}

function getAsteroids(asteroidMap) {
  let asteroids = [];
  
  for (let asteroidY = 0; asteroidY < asteroidMap.length; asteroidY++) {
    for (let asteroidX = 0; asteroidX < asteroidMap[asteroidY].length; asteroidX++) {
      if (asteroidMap[asteroidY][asteroidX] == '#') asteroids.push([asteroidY, asteroidX]);
    }
  }

  return asteroids;
}

function canSeeAsteroid(y, x, asteroidY, asteroidX, asteroidMap) {
  let deltaX = Math.abs(x - asteroidX);
  let deltaY = Math.abs(y - asteroidY);

  let slope = gcd(deltaX, deltaY);
  let slopeX = x > asteroidX ? -slope : slope;
  let slopeY = y > asteroidY ? -slope : slope;

  let curX = x, curY = y;

  for (let i = 0; i < slope - 1; i++) {
    if (deltaX != 0) curX += (deltaX / slopeX);
    if (deltaY != 0) curY += (deltaY / slopeY);

    if (asteroidMap[curY][curX] == '#') return false;
  }

  return true;
}

function getViewableAsteroids(y, x, asteroids, asteroidMap) {
  return asteroids.filter(([asteroidY, asteroidX]) => canSeeAsteroid(y, x, asteroidY, asteroidX, asteroidMap));
}

function findBestSpotToViewAsteroids(asteroidMap) {
  let asteroids = getAsteroids(asteroidMap);

  return asteroids.reduce(([bestSpot, bestNumSeen], [y, x]) => {
    let numSeen = getViewableAsteroids(y, x, asteroids, asteroidMap).length - 1;

    if (numSeen > bestNumSeen) return [[y,x], numSeen];
    else return [bestSpot, bestNumSeen];
  }, [undefined, 0]);
}

// Find the angle from 0 to 2pi
// with the laser at the center of a unit circle
function findAngle(laserY, laserX, y, x) {
  let deltaY = -(y - laserY);
  let deltaX = x - laserX;

  let value = -1 * (Math.atan2(deltaY, deltaX) - (Math.PI / 2));
  if (value < 0) value += (2 * Math.PI);

  return value;
}

function findNextTarget(laserY, laserX, currentRot, asteroids) {
  let minRot = Infinity;
  let target;

  let angles = asteroids.map(([asteroidY, asteroidX]) => findAngle(laserY, laserX, asteroidY, asteroidX));
  let validAngles = angles.filter(angle => angle > currentRot);
  let minAngle = validAngles.reduce((acc, angle) => Math.min(acc, angle), Infinity);
  
  if (validAngles.length == 0) return [undefined, Infinity];

  let minIdx = angles.indexOf(minAngle);

  return [asteroids[minIdx], minAngle];
}

const TARGET = 200;

// Destroy asteroids by rotating the laser, returning the TARGET-th asteroid destroyed
function destroyAsteroids([laserY, laserX], asteroidMap) {
  let count = 1;

  while (count < TARGET) {
    let angle = -.0001;

    while (angle != Infinity) {
      let asteroids = getAsteroids(asteroidMap);
      let viewableAsteroids = getViewableAsteroids(laserY, laserX, asteroids, asteroidMap);

      let [nextTarget, nextAngle] = findNextTarget(laserY, laserX, angle, viewableAsteroids);

      if (count == TARGET) {
        return nextTarget[1] * 100 + nextTarget[0];
      }

      if (nextAngle != Infinity) {
        let [nextY, nextX] = nextTarget;

        let row = asteroidMap[nextY].split("");
        row[nextX] = ".";
        asteroidMap[nextY] = row.join("");

        count++;
      }

      angle = nextAngle;
    }
  }
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  let [bestSpot, maxSeen] = findBestSpotToViewAsteroids(input);

  console.log(`Part one answer: ${maxSeen}`);
  console.log(`Part two answer: ${destroyAsteroids(bestSpot, input)}`);
}

module.exports = { main };