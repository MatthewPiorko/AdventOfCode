const fs = require("fs");
const path = require("path");
const _ = require('../../util/utils.js');

let hexToBinary = (hexString) => hexString.split('').map(char => Number.parseInt(char, 16).toString(2).padStart(4, "0")).reduce((acc, bytes) => acc + bytes, "");
let parseSubstringAsNumber = (bytes, start, end) => Number.parseInt(bytes.substring(start, end), 2);

function parseLiteral(bytes) {
  let number = "";
  let idx = 0;

  while (number === "" || bytes[idx - 5] === "1") {
    number += bytes.substring(idx + 1, idx + 5).padEnd(4, "0");
    idx += 5;
  }

  return [Number.parseInt(number, 2), idx];
}

function parseOperatorByLength(bytes) {
  let subPacketStart = 7 + 15;
  let end = subPacketStart + Number.parseInt(bytes.substring(7, subPacketStart), 2);
  
  let idx = subPacketStart;
  let subPacketValues = [];
  let totalVersion = 0;

  while (idx < end - 1) {
    let [subVersion, subPacketValue, subPacketEnd] = parsePacket(bytes.substring(idx));
    idx += subPacketEnd;
    subPacketValues.push(subPacketValue);
    totalVersion += subVersion;
  }

  return [totalVersion, subPacketValues, idx];
}

function parseOperatorByCount(bytes) {
  let subPacketStart = 7 + 11;
  let numPackets = Number.parseInt(bytes.slice(7, subPacketStart), 2);

  let totalVersion = 0;
  let subPacketValues = [];
  let idx = subPacketStart;

  for (let i = 0; i < numPackets; i++) {
    let [subVersion, subPacketValue, subPacketEnd] = parsePacket(bytes.substring(idx));
    idx += subPacketEnd;
    subPacketValues.push(subPacketValue);
    totalVersion += subVersion;
  }

  return [totalVersion, subPacketValues, idx];
}

function parseOperatorPacket(bytes) {
  let lengthTypeId = parseSubstringAsNumber(bytes, 6, 7);

  if (lengthTypeId === 0) {
    return parseOperatorByLength(bytes);
  } else {
    return parseOperatorByCount(bytes);
  }
}

function computeOperatorPacketValue(typeId, subPacketValues) {
  if (typeId === 0) return _.sum(subPacketValues);
  if (typeId === 1) return subPacketValues.reduce((acc, val) => acc * val, 1);
  if (typeId === 2) return _.min(subPacketValues);
  if (typeId === 3) return _.max(subPacketValues);
  if (typeId === 5) return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
  if (typeId === 6) return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
  if (typeId === 7) return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
}

function parsePacket(bytes) {
  let version = parseSubstringAsNumber(bytes, 0, 3);
  let typeId = parseSubstringAsNumber(bytes, 3, 6);

  if (typeId === 4) {
    let [literalValue, endIdx] = parseLiteral(bytes.slice(6));
    return [version, literalValue, endIdx + 6];
  }

  let [subVersionSum, subPacketValues, idx] = parseOperatorPacket(bytes);

  return [version + subVersionSum, computeOperatorPacketValue(typeId, subPacketValues), idx];
}

function partOne(inputs) {
  let [versionSum, value, end] = parsePacket(hexToBinary(inputs[0]));
  return versionSum;
}

function partTwo(inputs) {
  let [versionSum, value, end] = parsePacket(hexToBinary(inputs[0]));
  return value;
}

function main(file) {
  let inputs = fs.readFileSync(path.resolve(__dirname, file)).toString().trim().split(/\r?\n/);

  console.log(`Part one answer: ${partOne(inputs)}`);
  console.log(`Part two answer: ${partTwo(inputs)}`);
}

module.exports = { main };