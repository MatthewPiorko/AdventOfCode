const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

class Reaction {
  constructor(inputs, output) {
    this.inputs = inputs;
    this.output = output;
  }
}

function parseInput(input) {
  let reactionMap = {};
  let ingredients = {};

  for (let line of input) {
    let [, inputs, output] = line.match(/(.*) => (.*)/);
    let [, outputAmount, outputIngredient] = output.match(/(\d+) (.*)/);
    inputs = inputs.split(",");

    inputs = inputs.map(input => {
      let [, inputAmount, inputIngredient] = input.match(/(\d+) (.*)/);

      return [inputAmount, inputIngredient];
    });

    let reaction = new Reaction(inputs, [outputAmount, outputIngredient]);
    reactionMap[outputIngredient] = reaction;
    ingredients[outputIngredient] = 0;
  }

  return [reactionMap, ingredients];
}

// Determine the amount of ore required for 1 FUEL
function oreRequired(reactionMap, originalIngredients, startingFuel) {
  ingredients = Object.assign({}, originalIngredients);

  ingredients["FUEL"] = startingFuel;
  ingredients["ORE"] = 0;

  while (true) {
    let nextIngredient = Object.keys(ingredients).filter(i => ingredients[i] > 0 && i != "ORE")[0];

    if (nextIngredient == undefined) break;

    let reaction = reactionMap[nextIngredient];
    let numReactions = Math.ceil(ingredients[nextIngredient] / reactionMap[nextIngredient].output[0]);

    ingredients[nextIngredient] -= numReactions * reaction.output[0];

    for (ingredient of reaction.inputs) {
      ingredients[ingredient[1]] += numReactions * ingredient[0];
    }
  }

  return ingredients["ORE"];
}

// Determine the maximum FUEL that can be made with the available ORE
function maxFuelMade(reactionMap, ingredients, availableOre) {
  let highest = 1;
  while (oreRequired(reactionMap, ingredients, highest) < availableOre) highest *= 2;

  let hasInsufficientFuel = (n) => oreRequired(reactionMap, ingredients, n) > availableOre;

  return _.binarySearch(0, highest, hasInsufficientFuel) - 1;
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().trim().split(/\r?\n/);
  let [reactionMap, ingredients] = parseInput(input);

  console.log(`Part one answer: ${oreRequired(reactionMap, ingredients, 1)}`);
  console.log(`Part two answer: ${maxFuelMade(reactionMap, ingredients, 1000000000000)}`);
}

module.exports = { main };