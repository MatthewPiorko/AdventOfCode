const fs = require("fs");
const path = require("path");

// Calculate how much fuel a module of weight n needs.
function determineFuelCost(n) {
  return Math.floor(n / 3) - 2;
}

// Calculate the total fuel cost a module of weight n needs, including the fuel's weight.
function calculateTotalFuel(n) {
  let fuelForModule = determineFuelCost(n);

  if (fuelForModule <= 0) return 0;

  return fuelForModule + calculateTotalFuel(fuelForModule);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split('\n');

  let fuelCostWithModules = input.map(determineFuelCost).reduce((acc, n) => acc + n, 0);
  console.log(`Part one answer: ${fuelCostWithModules}`);

  let totalFuelCost = input.map(calculateTotalFuel).reduce((acc, n) => acc + n, 0);
  console.log(`Part two answer: ${totalFuelCost}`);
}

module.exports = { main };