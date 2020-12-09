var fs = require("fs");
var path = require("path");

// Find the number of trees (#) hit sliding down a toboggan going 3 right, 1 down
// Map is a 1d array of the geology; ex: ["..##..", "#...#"]
// SlideRight is the amount the toboggan moves right each move
// SlideDown is the amount the toboggan moves down each move
function findHits(map, slideRight, slideDown) {
  let currentX = 0, currentY = 0, numHits = 0;

  while (currentY < map.length) {
    if (map[currentY][currentX] == "#") numHits++;
    
    // Map wraps, so need to find the x position on the repeated map
    currentX = (currentX + slideRight) % (map[0].length);
    currentY += slideDown;
  }

  return numHits;
}

function main() {
  fs.readFile(path.resolve(__dirname, 'input.txt'), function (err, data) {
    let input = data.toString().split('\n').map(s => s.trim());
    console.log(findHits(input, 3, 1));

    let possibleSlopes = [[1,1], [3,1], [5,1], [7,1], [1,2]];
    let answer = possibleSlopes.map(slope => findHits(input, slope[0], slope[1]))
      .reduce((sum, moves) => sum * moves, 1);

    console.log(answer);
  });
}

module.exports = { main };