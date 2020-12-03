var fs = require("fs");

// Find the number of trees (#) hit sliding down a toboggan going 3 right, 1 down
// Map is a 1d array of the geology; ex: ["..##..", "#...#"]
// SlideRight is the amount the toboggan moves right each move
// SlideDown is the amount the toboggan moves down each move
function findHits(map, slideRight, slideDown) {
  let currentX = 0, currentY = 0, numHits = 0;

  while (currentY < map.length) {
    // Map wraps, so need to find the y position on the repeated map
    let wrappedX = (currentX) % (map[0].length);

    if (map[currentY][wrappedX] == "#") numHits++;
    
    currentX += slideRight;
    currentY += slideDown;
  }

  return numHits;
}

fs.readFile('input.txt', function (err, data) {
  let input = data.toString().split('\n').map(s => s.trim());
  console.log(findHits(input, 3, 1));

  let possibleSlopes = [[1,1], [3,1], [5,1], [7,1], [1,2]];
  let answer = possibleSlopes.map(slope => findHits(input, slope[0], slope[1]))
    .reduce((sum, moves) => sum * moves, 1);

  console.log(answer);
});