import sha256 from 'sha256'
import * as math from 'mathjs'
import randomStr from '../../randomStr.js'

export default async function RollNumber() {
    const hash = randomStr(64, '123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM')
    const currentRolllotery = randomStr(7, '123456789')
    let roll = 0
    let sh = sha256(hash + '-' + currentRolllotery)
    roll = sh.substr(0, 8)
    roll = parseInt(roll, 16);
    roll = math.abs(roll) % 10000;

    roll = roll / 100; // Map it to the range 0.00 to 99.99
    roll = roll + 0.01; // Shift it to the range 0.01 to 100.00

    return parseFloat(roll.toFixed(2)); // Convert to a string with 2 decimal places
}