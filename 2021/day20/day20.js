const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

let ADJ = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]];

const OBJECTS = {
  DARK: '.',
  LIGHT: '#'
};

function computeNextChar(image, x, y, algorithm, iter) {
  // On odd iterations, the cells will all be dark from the previous iter. On even iterations, the outside cells will be light
  let fallback = iter % 2 === 1 ? OBJECTS.DARK : OBJECTS.LIGHT;

  let pattern = ADJ.map(([deltaY, deltaX]) => _.safeGet2D(image, x + deltaX, y + deltaY, fallback))
    .map(char => char === OBJECTS.LIGHT ? 1 : 0)
    .join('');
  let idx = Number.parseInt(pattern, 2);

  return algorithm[idx];
}

function computeNextImage(image, algorithm, iter) {
  let nextImage = [];

  // The image can only grow by 1 on each computation
  for (let y = -1; y <= image.length; y++) {
    let nextRow = [];
    for (let x = -1; x <= image[0].length; x++) {
      nextRow.push(computeNextChar(image, x, y, algorithm, iter));
    }
    nextImage.push(nextRow);
  }

  return nextImage;
}

let countLights = (image) => _.sum(image.map(row => _.sum(row.map(char => char === OBJECTS.LIGHT ? 1 : 0))));

function enhanceImage(inputs, numIter) {
  let algorithm = inputs[0];
  let image = inputs.slice(2).map(row => row.split(''));

  for (let iter = 1; iter <= numIter; iter++) {
    image = computeNextImage(image, algorithm, iter);
  }

  return countLights(image);
}

function partOne(inputs) {
  return enhanceImage(inputs, 2);
}

function partTwo(inputs) {
  return enhanceImage(inputs, 50);
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };