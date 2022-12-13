const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

// parse a string to an array of arrays
function parse(str) {
  return parseRecursively(str)[0][0];
}

// return [parsedArray, endingIndex] for use when parsing an entire string
function parseRecursively(str) {
  let ret = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '[') {
      let [subArr, endIdx] = parseRecursively(str.substring(i + 1));
      i += endIdx;
      ret.push(subArr);
    } else if (str[i] === ']') {
      return [ret, i + 1];
    } else if (str[i] === ',') {
      continue;
    } else {
      let [_, match, end, rest] = str.substring(i).match(/^(\d+)(\]?)(.*)/);
      ret.push(Number(match));

      if (end !== '') return [ret, i + match.length + 1];

      i += match.length;
    }
  }

  return [ret, str.length - 1];
}

// return true if arr1 & arr2 in the correct order,
// undefined if they have the same ordering,
// or false if they are in the wrong order
function correctOrder(arr1, arr2) {
  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    if (i === arr1.length) return true;
    if (i === arr2.length) return false;

    if (typeof(arr1[i]) === "number" && typeof(arr2[i]) === "number") {
      if (arr1[i] < arr2[i]) return true;
      else if (arr1[i] > arr2[i]) return false;
      else continue;
    } else if (typeof(arr1[i]) === "object" && typeof(arr2[i]) === "object") {
      let subOrder = correctOrder(arr1[i], arr2[i]);
      if (subOrder !== undefined) return subOrder;
      else continue;
    } else if (typeof(arr1[i]) === "number" && typeof(arr2[i]) === "object") {
      let subOrder = correctOrder([arr1[i]], arr2[i]);
      if (subOrder !== undefined) return subOrder;
      else continue;
    } else if (typeof(arr1[i]) === "object" && typeof(arr2[i]) === "number") {
      let subOrder = correctOrder(arr1[i], [arr2[i]]);
      if (subOrder !== undefined) return subOrder;
      else continue;
    }
  }

  return undefined;
}

function partOne(inputs) {
  let numOrdered = 0;

  for (let count = 0; count < inputs.length; count++) {
    pair = inputs[count].split(/\r?\n/);
    let first = parse(pair[0]);
    let second = parse(pair[1]);

    // convert to 1-based indexing
    if (correctOrder(first, second)) numOrdered += count + 1;
  }

  return numOrdered;
}

function partTwo(inputs) {
  let sorted = [];
  sorted.push(parse('[[2]]'));
  sorted.push(parse('[[6]]'));

  for (let count = 0; count < inputs.length; count++) {
    pair = inputs[count].split(/\r?\n/);
    sorted.push(parse(pair[0]));
    sorted.push(parse(pair[1]));
  }

  sorted = sorted.sort((inputA, inputB) => {
    let ordered = correctOrder(inputA, inputB);
    return ordered ? -1 : 1;
  });

  let key1Index = sorted.findIndex(row => row.length === 1 && row[0].length === 1 && row[0][0] === 2);
  let key2Index = sorted.findIndex(row => row.length === 1 && row[0].length === 1 && row[0][0] === 6);

  // convert to 1-based indexing
  return (key1Index + 1) * (key2Index + 1);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n\r?\n/);

  let partOneStart = performance.now();
  console.log(`Part one answer: ${partOne(inputs)} (took ${(performance.now() - partOneStart).toFixed(0)}ms)`);

  let partTwoStart = performance.now()
  console.log(`Part two answer: ${partTwo(inputs)} (took ${(performance.now() - partTwoStart).toFixed(0)}ms)`);
}

module.exports = { main };