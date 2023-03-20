import {
  aok,
  beka,
  fire,
  hehe,
  hm,
  jasperAktywacja,
  jasperBoobsy,
  jasperSmiech,
  mhm,
  oho,
  okurwa,
  xdd,
} from "./discordEmotes.js";

export const seven = {
  id: "seven",
  name: "Siódemka",
  emoji: "7️⃣",
};
const bar = {
  id: "bar",
  name: "BAR",
  emoji: "🍫",
};
const melon = {
  id: "melon",
  name: "Melon",
  emoji: "🍉",
};
const bell = {
  id: "bell",
  name: "Dzwonek",
  emoji: "🔔",
};
export const orange = {
  id: "orange",
  name: "Pomarańcz",
  emoji: "🍊",
};
const banana = {
  id: "banana",
  name: "Banan",
  emoji: "🍌",
};
const cherry = {
  id: "cherry",
  name: "Wiśnia",
  emoji: "🍒",
};
const lemon = {
  id: "lemon",
  name: "Cytryna",
  emoji: "🍋",
};

export const slotsReelOne = [
  seven,
  bar,
  bar,
  bar,
  melon,
  melon,
  bell,
  orange,
  orange,
  orange,
  orange,
  orange,
  orange,
  orange,
  banana,
  banana,
  banana,
  banana,
  banana,
  cherry,
  cherry,
];

export const slotsReelTwo = [
  seven,
  bar,
  bar,
  melon,
  melon,
  bell,
  bell,
  bell,
  bell,
  bell,
  orange,
  orange,
  orange,
  banana,
  banana,
  banana,
  banana,
  banana,
  cherry,
  cherry,
  cherry,
  cherry,
  cherry,
  cherry,
];

export const slotsReelThree = [
  seven,
  bar,
  melon,
  melon,
  bell,
  bell,
  bell,
  bell,
  bell,
  bell,
  bell,
  bell,
  orange,
  orange,
  orange,
  banana,
  banana,
  banana,
  banana,
  lemon,
  lemon,
  lemon,
  lemon,
];

export const winningCombinations = [
  {
    combination: [seven, seven, seven],
    multiplier: 777,
    message: `TRZY SIÓDEMKI ${fire} 🎰 !!MAXWIN!! 🎰 ${fire} `,
  },
  {
    combination: [bar, bar, bar],
    multiplier: 333,
    message: `TRZY CZEKOLADKI ${okurwa} ${okurwa} `,
  },
  {
    combination: [melon, melon, bar],
    multiplier: 250,
    message: `dwa arbuziki i czekoladka ${jasperAktywacja} `,
  },
  {
    combination: [bell, bell, bar],
    multiplier: 200,
    message: `dwa dzwoneczki i czekoladka ${oho} `,
  },
  {
    combination: [melon, melon, melon],
    multiplier: 150,
    message: `trzy arbuziki ${jasperBoobsy} `,
  },
  {
    combination: [orange, orange, bar],
    multiplier: 72,
    message: `dwie pomarańczki i czekoladka ${oho} ${hm} `,
  },
  {
    combination: [banana, banana, bar],
    multiplier: 48,
    message: `dwa bananki i czekoladka ${oho} ${oho} `,
  },
  {
    combination: [bell, bell, bell],
    multiplier: 32,
    message: `trzy dzwoneczki ${hm} `,
  },
  {
    combination: [orange, orange, orange],
    multiplier: 18,
    message: `trzy pomarańcze ${jasperAktywacja} `,
  },
  {
    combination: [banana, banana, banana],
    multiplier: 12,
    message: `trzy banany ${jasperAktywacja} `,
  },
  {
    combination: [cherry, cherry],
    multiplier: 6,
    message: `dwie wisieńki ${oho} `,
  },
  {
    combination: [cherry],
    multiplier: 3,
    message: `jedna wisienka ${aok} `,
  },
];

export const losingMessages = [
  `${jasperSmiech} `,
  `${jasperSmiech} `,
  `${beka} `,
  `${beka} `,
  `${xdd} `,
  `${xdd} `,
  `może kiedyś się uda ${beka} `,
  `może kiedyś się uda ${beka} `,
  `może kiedyś się uda ${beka} `,
  `może kiedyś się uda ${hm} `,
  `może kiedyś się uda ${hm} `,
  `może kiedyś się uda ${hm} `,
  `ale se grasz ${mhm} `,
  `ale se grasz ${mhm} `,
  `ale se grasz ${mhm} `,
  `ej a wygrasz coś kiedyś? ${hehe} `,
  `ej a wygrasz coś kiedyś? ${hehe} `,
  `ej a wygrasz coś kiedyś? ${xdd} `,
  `ej a wygrasz coś kiedyś? ${xdd} `,
  `#STOPZHAZARDEM serio ${aok} `,
];

export const slotsInfo = `Proste slotsy na 3 rolki autorstwa lepszego programisty - ziomiwan ${hm}. Maksymalny możliwy win - x777. Najprawdopodobniej bedziecie na - jak w prawdziwych slotsach ${hehe}. Nie ponosze odpowiedzialności za stracone punkty ${aok}. Wszystkie szanse na wygrana otestowane i zatwierdzone przez największa hazardzistke - <@632307504063447040> także wszelkie zażalenia odnośnie dropu proszę kierować do niej ${aok}.`;
