const _ = require('../../util/utils.js');

function prune(secret) {
  return _.safeMod(secret, 16777216);
}

function nextSecret(secret) {
  secret = prune(secret ^ (secret * 64));
  secret = prune(secret ^ Math.floor(secret / 32));
  return prune(secret ^ (secret * 2048));
}

function partOne(inputs, testMode) {
  return _.sum(inputs.map(input => findAllSecrets(Number(input)).at(-1)));
}

function findAllSecrets(secret) {
  let prices = [ ];
  for (let i = 0; i < 2000; i++) {
    secret = nextSecret(secret);
    prices.push(secret);
  }

  return prices;
}

function findPriceCalls(input) {
  let prices = findAllSecrets(input).map(x => x % 10);
  let priceDiffs = [];
  for (let i = 1; i < prices.length; i++) {
    priceDiffs.push(prices[i] - prices[i - 1]);
  }

  let priceCalls = {};
  for (let i = 3; i < priceDiffs.length - 1; i++) {
    let sequence = `${priceDiffs[i - 3]},${priceDiffs[i - 2]},${priceDiffs[i - 1]},${priceDiffs[i]}`;
    
    // only allow the first of each sequence
    if (priceCalls[sequence] === undefined) priceCalls[sequence] = prices[i + 1];
  }

  return priceCalls;
}

function partTwo(inputs, testMode) {
  let allPriceCalls = inputs.map(input => findPriceCalls(input));
  let possiblePriceCalls = new Set();
  for (let priceCalls of allPriceCalls) {
    for (let priceCall of Object.keys(priceCalls)) possiblePriceCalls.add(priceCall);
  }

  let bestWin = -Infinity;
  for (let possiblePriceCall of possiblePriceCalls) {
    let sum = _.sum(allPriceCalls.map(priceCalls => priceCalls[possiblePriceCall] || 0));
    if (sum > bestWin) bestWin = sum;
  }

  return bestWin;
}

module.exports = { partOne, partTwo };