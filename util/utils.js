function range(start, stop, step = 1, initial = undefined) {
  let len = Math.abs(stop - start) + 1;

  if (start > stop && step > 0) step *= -1;
  if (start < stop && step < 0) step *= -1;

  return Array.from({ length: len }, (val, idx) => initial || start + (idx * step));
}

function arr2D(x, y, initial = undefined) {
  return Array.from({ length: y }, (val, idx) => Array.from({ length: x }, (val, idx) => initial));
}

function print2D(arr2D, sep = '') {
  for (let row of arr2D) {
    console.log(row.join(sep));
  }
  console.log('');
}

function arrEqual2D(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let y = 0; y < arr1.length; y++) {
    if (arr1[y].length !== arr2[y].length) return false;

    if (range(0, arr1[y].length).some(i => arr1[y][i] !== arr2[y][i])) return false;
  }

  return true;
}

function map2D(arr2D, f) {
  return arr2D.map(arr => arr.map(f));
}

function safeGet2D(arr2D, x, y, fallback = undefined) {
  if (y < 0 || y >= arr2D.length) return fallback;
  if (x < 0 || x >= arr2D[0].length) return fallback;
  return arr2D[y][x];
}

function sum(arr) {
  return arr.reduce((acc, val) => val + acc, 0);
}

function product(arr) {
  return arr.reduce((acc, val) => val * acc, 1);
}

function sum2D(arr2D) {
  return arr2D.reduce((acc, arr) => sum(arr) + acc, 0);
}

function max(arr) {
  return arr.reduce((acc, val) => Math.max(val, acc), -Infinity);
}

function min(arr) {
  return arr.reduce((acc, val) => Math.min(val, acc), +Infinity);
}

function gcd(a, b) {
  if (b == 0) return a;

  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

// can do modulo on negative numbers, from https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function safeMod(n, mod) {
  return ((n % mod) + mod) % mod;
}

function find2D(grid, obj) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === obj) return [x, y];
    }
  }

  return undefined;
}

const ADJ = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const ORTHOGONAL_ADJ = [[-1,0],[1,0],[0,-1],[0,1]];
const ORTHOGONAL_ADJ_3D = [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]];

module.exports = { 
  range, arr2D, arrEqual2D, print2D, map2D, safeGet2D, sum, product, sum2D, 
  max, min, gcd, lcm, safeMod, find2D,
  ADJ, ORTHOGONAL_ADJ, ORTHOGONAL_ADJ_3D };