import { okurwa } from "./data/discordEmotes.js";
import {
  losingMessages,
  slotsReelOne,
  slotsReelThree,
  slotsReelTwo,
  winningCombinations,
} from "./data/slotsData.js";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const getRandomElementFromArray = (array) => {
  return array[getRandomInt(array.length)];
};

function rollSlotsReels() {
  return [
    getRandomElementFromArray(slotsReelOne),
    getRandomElementFromArray(slotsReelTwo),
    getRandomElementFromArray(slotsReelThree),
  ];
}

const compare = (rolledCombination, singleCombination) => {
  return singleCombination ? rolledCombination === singleCombination : true;
};

const compareResultWithWinningCombinations = (rolledSymbols, singleWinComb) => {
  return (
    compare(rolledSymbols[0], singleWinComb[0]) &&
    compare(rolledSymbols[1], singleWinComb[1]) &&
    compare(rolledSymbols[2], singleWinComb[2])
  );
};

const buildLosingOutput = (rolledSymbols) => {
  const mappedSymbolsToString = rolledSymbols
    .map((symbol) => {
      return "[" + symbol.emoji + "] ";
    })
    .join(" ");

  const mockText = getRandomElementFromArray(losingMessages);
  const message =
    "przegrałeś/aś wszystko, " + mockText + "- " + mappedSymbolsToString;
  return {
    message: message,
    multiplier: 0,
    totalWin: 0,
  };
};

const buildWinningOutput = (winComb, gambleAmount) => {
  const mappedSymbolsToString = winComb.combination
    .map((symbol) => {
      return "[" + symbol.emoji + "] ";
    })
    .join(" ");

  const totalWin = gambleAmount * winComb.multiplier;
  const multiplier = `x${winComb.multiplier} `;
  const message =
    `wygrałeś/aś ${totalWin} punktow ${okurwa} ` +
    winComb.message +
    multiplier +
    mappedSymbolsToString;

  return {
    message: message,
    multiplier: winComb.multiplier,
    totalWin: totalWin,
  };
};

const find = (rolledSymbols, gambleAmount) => {
  const result = winningCombinations.find((winComb) => {
    if (
      compareResultWithWinningCombinations(rolledSymbols, winComb.combination)
    ) {
      return rolledSymbols;
    } else {
      return null;
    }
  });
  return result
    ? buildWinningOutput(result, gambleAmount)
    : buildLosingOutput(rolledSymbols);
};

export const runSlots = (gambleAmount) => {
  const rolledSymbols = rollSlotsReels();
  return find(rolledSymbols, gambleAmount);
};
