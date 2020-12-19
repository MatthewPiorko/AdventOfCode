const fs = require("fs");
const path = require("path");

const BORDER = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3
};

const MONSTER = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   "
];

class Image {
  constructor() {
    this.id = 0;
    this.lines = [];
    this.sides = [];
  }
}

function safeGet(y, x, image) {
  if (y < 0 || y >= image.length || x < 0 || x >= image[0].length) return undefined;

  return image[y][x];
}

function determineSides(image) {
  let topBorder = image.lines[0];
  let rightHandBorder = image.lines.map(line => line[line.length - 1]).join("");
  let bottomBorder = image.lines[image.lines.length - 1];
  let leftHandBorder = image.lines.map(line => line[0]).join("");

  let borders = [topBorder, rightHandBorder, bottomBorder, leftHandBorder];
  let reversed = borders.map(border => border.split("").reverse().join(""));

  image.sides = [...borders, ...reversed];
}

// Line up two images side by side, where the right side of image1 matches the left side of image2
function lineUpLeftRight(image1, image2) {
  let matchingBorders = getMatchingBorders(image1, image2);

  let matchingFirstBorder = matchingBorders[0];

  while (matchingFirstBorder != BORDER.RIGHT) {
    rotateImage(image1);
    matchingFirstBorder = (matchingFirstBorder + 1) % 4;
  }

  for (let i = 0; i < 4; i++) {
    if (image1.sides[BORDER.RIGHT] == image2.sides[BORDER.LEFT]) return;

    rotateImage(image2);
  }

  flipImageUpsideDown(image2);

  for (let i = 0; i < 4; i++) {    
    if (image1.sides[BORDER.RIGHT] == image2.sides[BORDER.LEFT]) return;

    rotateImage(image2);
  }
}

// Rotate a 2d image by 90 degrees clockwise
function rotateLines(lines) {
  let newLines = [];

  for (let x = 0; x < lines.length; x++) {
    let newLine = [];

    for (let y = lines.length - 1; y >= 0; y--) {
      newLine.push(lines[y][x]);
    }

    newLines.push(newLine.join(""));
  }

  return newLines;
}

function rotateImage(image) {
  image.lines = rotateLines(image.lines);
  determineSides(image);
}

function flipLinesUpsideDown(lines) {
  return lines.reverse();
}

function flipImageUpsideDown(image) {
  image.lines = flipLinesUpsideDown(image.lines);
  determineSides(image);
}

function getMatchingBorders(image1, image2) {
  for (let border1Idx = 0; border1Idx < 8; border1Idx++) {
    let border1 = image1.sides[border1Idx];

    for (let border2Idx = 0; border2Idx < 8; border2Idx++) {
      let border2 = image2.sides[border2Idx];

      if (border1 == border2) return [border1Idx, border2Idx];
    }
  }
}

function parseImages(input) {
  let images = [];
  let cur = new Image();

  for (line of input) {
    if (line.length == 0) { 
      images.push(cur); 
      cur = new Image(); 
      continue;
    }

    if (line.match(/Tile/)) {
      let [_, id] = line.match(/Tile (\d+):/);
      cur.id = id;
    } else {
      cur.lines.push(line);
    }
  }

  images.push(cur);
  images.forEach(determineSides);

  return images;
}

function createBorderMap(images) {
  let borderMap = {};
  for (image of images) borderMap[image.id] = new Set();

  for (firstImage of images) {
    for (side of firstImage.sides) {
      for (otherImage of images) {
        for (otherSide of otherImage.sides) {
          if (side == otherSide) borderMap[firstImage.id].add(otherImage.id);
        }
      }
    }
  }

  for (image of images) borderMap[image.id].delete(image.id);

  return borderMap;
}

function findCornerIdsProduct(input) {
  let images = parseImages(input);
  let borderMap = createBorderMap(images);

  let corners = images.filter(image => borderMap[image.id].size == 2);

  return corners.map(corner => corner.id).reduce((acc, id) => acc * Number(id), 1);
}

const ADJACENT_DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];

// Given a map of adjacent images, create the full image
function assembleImage(images, borderMap, imageSize) {
  let reassembledImage = new Array(imageSize).fill(undefined).map(row => new Array(imageSize));
  
  let remainingImageIds = images.map(image => image.id);

  // The image at (y, x) is any image that borders all existing neighbors,
  // and has the correct number of neighbors (corners only have two neighbors, edges have three)
  for (let y = 0; y < imageSize; y++) {
    for (let x = 0; x < imageSize; x++) {
      let requiredNeighbors = ADJACENT_DIRECTIONS
        .map(([dirX, dirY]) => safeGet(y + dirY, x + dirX, reassembledImage))
        .filter(id => id != undefined);
      
      let numNeighbors = 4;
      if (y == 0 || y == imageSize - 1) numNeighbors--;
      if (x == 0 || x == imageSize - 1) numNeighbors--;

      let nextId = remainingImageIds
        .filter(imageId => requiredNeighbors.every(neighbor => borderMap[neighbor].has(imageId)))
        .filter(id => borderMap[id].size == numNeighbors)[0];

      remainingImageIds = remainingImageIds.filter(id => id != nextId);

      reassembledImage[y][x] = nextId;
    }
  }

  return reassembledImage;
}

function removeBorders(image) {
  image.lines = image.lines.slice(1, image.lines.length - 1)
    .map(line => line.split("").slice(1, line.length - 1).join(""));
}

function createCompleteImage(reassembledImage, imageMap) {
  let completeImage = [];

  for (row of reassembledImage) {
    let newRows = [];

    for (id of row) {
      for (let idx = 0; idx < 8; idx++) {
        newRows[idx] = (newRows[idx] || "") + imageMap[id].lines[idx];
      }
    }

    completeImage = [...completeImage, ...newRows];
  }

  return completeImage;
}

function makeSeaMonsterDirections() {
  let dirs = [];

  for (let y = 0; y < MONSTER.length; y++) {
    for (let x = 0; x < MONSTER[y].length; x++) {
      if (MONSTER[y][x] == "#") dirs.push([y, x]);
    }
  }

  return dirs;
}

function monsterExistsAt(y, x, completeImage, monsterDirections) {
  return monsterDirections.every(([dirY, dirX]) => safeGet(y + dirY, x + dirX, completeImage) == "#");
}

function findSeaMonsters(completeImage, monsterDirections) {
  let numMonsters = 0;

  for (let y = 0; y < completeImage.length; y++) {
    for (let x = 0; x < completeImage[y].length; x++) {
      if (monsterExistsAt(y, x, completeImage, monsterDirections)) numMonsters++;
    }
  }

  return numMonsters;
}

function findMapAndSeaMonsters(input) {
  let images = parseImages(input);
  let imageSize = Math.sqrt(images.length);

  let imageMap = images.reduce((acc, image) => { acc[image.id] = image; return acc; }, {});

  let borderMap = createBorderMap(images);
  let reassembledImage = assembleImage(images, borderMap, imageSize);

  // Rearrange images left to right so that adjacent borders line up
  for (let y = 0; y < imageSize; y++) {
    for (let x = 0; x < imageSize - 1; x++) {
      let firstImage = imageMap[reassembledImage[y][x]];
      let secondImage = imageMap[reassembledImage[y][x + 1]];

      lineUpLeftRight(firstImage, secondImage);
    }
  }

  // Rearrange images vertically so that top and bottom borders line up
  for (let y = 0; y < imageSize - 1; y++) {
    let firstImage = imageMap[reassembledImage[y][0]];
    let secondImage = imageMap[reassembledImage[y+1][0]];

    let [firstMatchingBorder, secondMatchingBorder] = getMatchingBorders(firstImage, secondImage);

    if (firstMatchingBorder == BORDER.TOP) {
      reassembledImage[y].forEach(imageId => flipImageUpsideDown(imageMap[imageId]));
    }

    if (secondMatchingBorder == BORDER.BOTTOM) {
      reassembledImage[y+1].forEach(imageId => flipImageUpsideDown(imageMap[imageId]));
    }
  }

  images.forEach(image => removeBorders(image));

  let completeMap = createCompleteImage(reassembledImage, imageMap);

  let rotatedMaps = [completeMap, 
    rotateLines(completeMap), 
    rotateLines(rotateLines(completeMap)),
    rotateLines(rotateLines(rotateLines(completeMap)))
  ];
  let flippedMaps = rotatedMaps.map(image => flipLinesUpsideDown(image.slice()));

  let monsterDirections = makeSeaMonsterDirections();

  let maxMonsters = [...rotatedMaps, ...flippedMaps]
    .reduce((acc, map) => Math.max(acc, findSeaMonsters(map, monsterDirections)), 0);

  let numEmpty = completeMap.join("").split("").filter(char => char == "#").length;

  return numEmpty - (maxMonsters * monsterDirections.length);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${findCornerIdsProduct(input)}`);
  console.log(`Part two answer: ${findMapAndSeaMonsters(input)}`);
}

module.exports = { main };