const fs = require("fs");
const path = require("path");

function parseValueMaskInstructions(input) {
  let mask = [];
  let memory = {};

  for (line of input) {
    let maskRegex = line.match(/mask = (.{36})/);

    if (maskRegex != undefined) {
      mask = maskRegex[1].split("");
      continue;
    }

    let [_, addr, val] = line.match(/mem\[(\d+)\] = (\d+)/);
    val = Number(val).toString(2).padStart(36, "0");

    let maskedVal = mask.map((char, idx) => char == "X" ? val[idx] : char).join("");

    memory[addr] = parseInt(maskedVal, 2);
  }

  return Object.keys(memory).reduce((acc, mem) => Number(memory[mem]) + acc, 0);
}

function generatePermutations(maskedAddr, remainingLength) {
  if (remainingLength == 0) {
    return [[]];
  }

  let subPermutations = generatePermutations(maskedAddr, remainingLength - 1);

  let char = maskedAddr[36 - remainingLength];
  if (char != "X") {
    return subPermutations.map(perm => [char, ...perm]);
  } else {
    return subPermutations.reduce((permutations, perm) => {
      permutations.push(["0", ...perm]);
      permutations.push(["1", ...perm]);

      return permutations;
    }, []);
  }
}

function parseAddressMaskInstructions(input) {
  let mask = [];
  let memory = {};

  for (line of input) {
    let maskRegex = line.match(/mask = (.{36})/);

    if (maskRegex != undefined) {
      mask = maskRegex[1].split("");
      continue;
    }

    let [_, addr, val] = line.match(/mem\[(\d+)\] = (\d+)/);
    addr = Number(addr).toString(2).padStart(36, "0");

    let maskedAddr = mask.map((char, idx) => {
      return char == "0" ? addr[idx] : char;
    });

    let addresses = generatePermutations(maskedAddr, 36);

    for (address of addresses) {
      let decimalAddr = parseInt(address.join(""), 2);
      memory[decimalAddr] = val;
    }
  }

  return Object.keys(memory).reduce((acc, mem) => Number(memory[mem]) + acc, 0);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${parseValueMaskInstructions(input)}`);
  console.log(`Part two answer: ${parseAddressMaskInstructions(input)}`);
}

module.exports = { main };