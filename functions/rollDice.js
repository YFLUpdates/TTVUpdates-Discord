import sha256 from "sha256";
import * as math from "mathjs";

function randomStr(len, arr) {
    let ans = "";
    for (var i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

export default async function rollDice() {
  const hash = randomStr(
    64,
    "123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
  );
  const currentRolllotery = randomStr(7, "123456789");
  let roll = 0;
  let sh = sha256(hash + "-" + currentRolllotery);
  roll = sh.substr(0, 8);
  roll = parseInt(roll, 16);
  roll = math.abs(roll) % 6;

  return roll+1;
}
