const fs = require("fs");
const path = require("path");

const SHINY_GOLD_COLOR = "shiny gold";

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n').map(s => s.trim());

  let combinedBagMap = input.map(createBagPair)
    .reduce((acc, val) => { acc[val[0]] = val[1]; return acc; }, {});

  console.log(searchAllColorsForShinyGold(combinedBagMap));

  // Remove one to not include the shiny gold bag itself
  console.log(countInnerBags(combinedBagMap, SHINY_GOLD_COLOR) - 1);
}

// Create a pair of [bag color, [count & color of each inner bag]] from a description of the bag
function createBagPair(input) {
  let regex = /(\w+ \w+) bags contain (.*)./

  let matches = input.match(regex);
  let bagType = matches[1];
  let bagStrings = matches[2];

  let subBags = bagStrings == "no other bags" ? [] : 
    bagStrings.split(',').map(str => {
      let subMatch = str.match(/(\d) (\w+ \w+) bags?/);

      return [subMatch[1], subMatch[2]];
    });

  return [bagType, subBags];
}

// Find how many bags can eventually contain a shiny gold bag
function searchAllColorsForShinyGold(map) {
  return Object.keys(map).reduce((acc, val) => searchColorForShinyGold(map, val) ? acc + 1 : acc, 0);
}

function searchColorForShinyGold(map, color) {
  let innerColors = map[color].map(countAndColor => countAndColor[1]);
  
  if (innerColors.includes(SHINY_GOLD_COLOR)) return true;

  return innerColors.some(color => searchColorForShinyGold(map, color));
}

// Count how bags are inside this bag, including itself
function countInnerBags(map, color) {
  let totalInnerCount = map[color].map(countAndColor => {
    let innerCount = countAndColor[0], innerColor = countAndColor[1];
    return innerCount * countInnerBags(map, innerColor);
  }).reduce((acc, val) => acc + val, 0);

  // Add one to inside bags count to include this bag
  return totalInnerCount + 1;
}

module.exports = { main };