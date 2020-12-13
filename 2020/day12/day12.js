const fs = require("fs");
const path = require("path");

function moveShip(input) {
  let rotation = 0;
  let curX = 0, curY = 0;

  for (direction of input) {
    let [_, move, amount] = direction.match(/(\w)(\d+)/);
    amount = Number(amount);

    if (move == "F") {
      if (rotation == 0) {
        curX += amount;
      } else if (rotation == 90) {
        curY -= amount;
      } else if (rotation == 180) {
        curX -= amount;
      } else if (rotation == 270) {
        curY += amount;
      }
    }

    if (move == "N") {
      curY += amount;
    } else if (move == "S") {
      curY -= amount;
    } else if (move == "E") {
      curX += amount;
    } else if (move == "W") {
      curX -= amount;
    }

    if (move == "L") {
      rotation = ((rotation - amount) + 360) % 360;
    } else if (move == "R") {
      rotation = ((rotation + amount) + 360) % 360;
    }
  }

  return Math.abs(curX) + Math.abs(curY);
}

function moveShipAndWaypoint(input) {
  let curX = 0, curY = 0;
  let wayX = 10, wayY = 1;

  for (direction of input) {
    let [_, move, amount] = direction.match(/(\w)(\d+)/);
    amount = Number(amount);

    if (move == "F") {
      curX += (amount * wayX);
      curY += (amount * wayY);
    } 

    if (move == "N") {
      wayY += amount;
    } else if (move == "S") {
      wayY -= amount;
    } else if (move == "E") {
      wayX += amount;
    } else if (move == "W") {
      wayX -= amount;
    }

    if ((move == "L" || move == "R") && amount == 180) {
      wayY = -wayY;
      wayX = -wayX;
    } else if ((move == "L" && amount == 90) || (move == "R" && amount == 270)) {
      let temp = wayX;
      wayX = -wayY;
      wayY = temp;
    } else if ((move == "R" && amount == 90) || (move == "L" && amount == 270)) {
      let temp = wayX;
      wayX = wayY;
      wayY = -temp;
    }
  }

  return Math.abs(curX) + Math.abs(curY);
}

function main() {
  let input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString().split(/\r?\n/);

  console.log(`Part one answer: ${moveShip(input)}`);
  console.log(`Part two answer: ${moveShipAndWaypoint(input)}`);
}

module.exports = { main };