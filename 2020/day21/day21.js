const fs = require("fs");
const path = require("path");

function parseInput(input) {
  let allIngredients = new Set();
  let allAllergens = {};
  let allRules = [];

  for (line of input) {
    let [_, ingredients, allergens] = line.match(/(.*) \(contains (.*)\)/);
    ingredients = ingredients.split(" ");
    allergens = allergens.split(", ");

    allergens.forEach(allergen => allAllergens[allergen] = []);
    ingredients.forEach(ingredient => allIngredients.add(ingredient));

    allRules.push([ingredients, allergens]);
  }

  return [allIngredients, allAllergens, allRules];
}

// Determine which allergens may be caused by which ingredients
function determinePotentialAllergens(ingredients, allergens, rules) {
  Object.keys(allergens).forEach(allergen => allergens[allergen] = new Set(ingredients));

  rules.forEach(([ruleIngredients, ruleAllergens]) => {
    ruleAllergens.forEach(allergen => {
      allergens[allergen].forEach(ingredient => {
        if (ruleIngredients.indexOf(ingredient) == -1) allergens[allergen].delete(ingredient);
      })
    })
  });
}

function determineSafeIngredients(input) {
  let [ingredients, allergens, rules] = parseInput(input);
  determinePotentialAllergens(ingredients, allergens, rules);

  let safeIngredients = Array.from(ingredients).filter(
    ingredient => Object.keys(allergens).every(allergen => !allergens[allergen].has(ingredient)));

  return rules.reduce((appearances, [ruleIngredients, _]) => 
    appearances + safeIngredients.reduce((ruleAppearances, safeIngredient) => 
      ruleAppearances + (ruleIngredients.indexOf(safeIngredient) != -1), 0)
    , 0);
}

function determineAllergenIngredients(input) {
  let [allIngredients, allAllergens, allRules] = parseInput(input);
  determinePotentialAllergens(allIngredients, allAllergens, allRules);

  let allergenMapping = {};

  while (Object.keys(allergenMapping).length < Object.keys(allAllergens).length) {
    for (allergen of Object.keys(allAllergens)) {
      if (allAllergens[allergen].size == 1) {
        let badIngredient = allAllergens[allergen].values().next().value;
        allergenMapping[allergen] = badIngredient;

        for (otherAllergen of Object.keys(allAllergens)) {
          allAllergens[otherAllergen].delete(badIngredient);
        }
      }
    }
  }

  return Object.keys(allergenMapping).map(allergen => [allergen, allergenMapping[allergen]])
    .sort((allergenPair1, allergenPair2) => allergenPair1[0].localeCompare(allergenPair2[0]))
    .map(allergenPair => allergenPair[1])
    .join(",");
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${determineSafeIngredients(input)}`);
  console.log(`Part two answer: ${determineAllergenIngredients(input)}`);
}

module.exports = { main };