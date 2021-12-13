const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

function parseInputs(inputs) {
  let emptyLine = inputs.indexOf('');
  let dots = inputs.slice(0, emptyLine).map(input => input.split(',').map(Number));
  let folds = inputs.slice(emptyLine + 1);

  return [dots, folds];
}

function foldPoint(x, y, foldType, foldValue) {
  let foldedX = foldType === 'x' && x > foldValue ? x - (2 * (x - foldValue)) : x;
  let foldedY = foldType === 'y' && y > foldValue ? y - (2 * (y - foldValue)) : y;
  return [foldedX, foldedY];
}

function runFolds(dots, folds) {
  return folds.reduce((dots, fold) => {
    let [group, foldType, foldValue] = fold.match(/fold along (\w)=(\d+)/);
    return dots.map(([x,y]) => foldPoint(x, y, foldType, foldValue));
  }, dots);
}

function partOne(inputs) {
  let [dots, folds] = parseInputs(inputs);  
  dots = runFolds(dots, folds.slice(0, 1)); // Only run the first fold for part 1

  return new Set(dots.map(dot => `${dot[0]},${dot[1]}`)).size;
}

function partTwo(inputs) {
  let [dots, folds] = parseInputs(inputs);
  dots = runFolds(dots, folds);

  let map = _.arr2D(_.max(dots.map(dot => dot[0])) + 1, _.max(dots.map(dot => dot[1])) + 1, '.');
  dots.forEach(dot => map[dot[1]][dot[0]] = '#');

  _.print2D(map);
  return 'shown above';
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part one answer: ${partTwo(inputs)}`);
}

module.exports = { main };