const fs = require("fs");
const path = require("path");

class Moon {
  constructor(str) {
    let [_, x, y, z] = str.match(/<x=(.*), y=(.*), z=(.*)>/).map(Number);

    this.pos = [x, y, z];
    this.vel = [0, 0, 0];
  }
}

function sum(list) {
  return list.reduce((acc, val) => acc + val, 0);
}

function adjustMoonVels(moon1, moon2) {
  for (let posIdx = 0; posIdx < moon1.pos.length; posIdx++) {
    let p1 = moon1.pos[posIdx];
    let p2 = moon2.pos[posIdx];

    if (p1 > p2) {
      moon1.vel[posIdx]--;
      moon2.vel[posIdx]++;
    }

    if (p1 < p2) {
      moon1.vel[posIdx]++;
      moon2.vel[posIdx]--;
    }
  }
}

function advanceTime(moons) {
  for (let moon1Idx = 0; moon1Idx < moons.length; moon1Idx++) {
    for (let moon2Idx = moon1Idx + 1; moon2Idx < moons.length; moon2Idx++) {
      adjustMoonVels(moons[moon1Idx], moons[moon2Idx]);
    }
  }

  for (moon of moons) {
    for (let coord = 0; coord < moon.pos.length; coord++) {
      moon.pos[coord] += moon.vel[coord];
    }
  }
}

function totalEnergy(moons) {
  return sum(moons.map(moon => {
    let potentialEnergy = sum(moon.pos.map(Math.abs));
    let kineticEnergy = sum(moon.vel.map(Math.abs));

    return potentialEnergy * kineticEnergy;
  }));
}

function determineEnergyAt(moons, numSteps) {
  for (let i = 0; i < numSteps; i++) {
    advanceTime(moons);
  }

  return totalEnergy(moons);
}

function stringifyDimension(moons, idx) {
  return moons.map(moon => `${moon.pos[idx]}/${moon.vel[idx]}`).join(";");
}

function determineLoopIteration(moons) {
  let seenDims = [new Set(), new Set(), new Set()];
  let answer = [undefined, undefined, undefined];
  let t = 0;

  while (answer.some(x => x == undefined)) {
    for (let idx = 0; idx < 3; idx++) {
      let str = stringifyDimension(moons, idx);

      if (seenDims[idx].has(str) && answer[idx] == undefined) { console.log(str); answer[idx] = t; }

      seenDims[idx].add(str);
    }

    advanceTime(moons);

    t++;
  }

  return lcm(lcm(answer[0], answer[1]), answer[2]);
}

function gcd(a, b) {
  if (b == 0) return a;

  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function main() {
  let moons = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/)
    .map(line => new Moon(line));

  console.log(`Part one answer: ${determineEnergyAt(moons, 1000)}`);
  console.log(`Part two answer: ${determineLoopIteration(moons)}`);
}

module.exports = { main };