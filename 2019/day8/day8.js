const fs = require("fs");
const path = require("path");

const WIDTH = 25, HEIGHT = 6;

function createLayers(input) {
  let layers = [];

  for (let i = 0; i < input.length; i += (WIDTH * HEIGHT)) {
    layers.push(input.substring(i, i + (WIDTH * HEIGHT)));
  }

  return layers;
}

function countCharacters(str, charToCount) {
  return str.split("").reduce((acc, char) => acc + (char == charToCount), 0);
}

function findMinimumLayer(layers) {
  let [minimumLayer, _] = layers.reduce(([minLayer, minZeroes], layer) => {
    let numZeroes = countCharacters(layer, "0");

    if (numZeroes < minZeroes) {
      return [layer, numZeroes];
    }

    return [minLayer, minZeroes];
  }, ["", Infinity]);

  return countCharacters(minimumLayer, "1") * countCharacters(minimumLayer, "2");
}

function calculatePixelAt(layers, position) {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i][position] == "0") return " ";
    if (layers[i][position] == "1") return "*";
  }
}

function decodeImage(layers) {
  let finalImage = "";
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    finalImage += calculatePixelAt(layers, i);
  }

  let finalImageAscii = [];
  for (let i = 0; i < finalImage.length; i += WIDTH) {
    finalImageAscii.push(finalImage.substring(i, i + WIDTH));
  }

  return finalImageAscii.join('\n');
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);
  let layers = createLayers(input[0]);

  console.log(`Part one answer: ${findMinimumLayer(layers)}`);
  console.log(`Part two answer:\n${decodeImage(layers)}`);
}

module.exports = { main };