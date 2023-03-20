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
  //0.008%
  {
    combination: [seven, seven, seven],
    multiplier: 777,
    message: `TRZY SIÓDEMKI ${fire} 🎰 !!MAXWIN!! 🎰 ${fire} `,
  },
  //0.03%
  {
    combination: [melon, melon, bar],
    multiplier: 333,
    message: `DWA ARBUZIKI I CZEKOLADKA ${fire} ${jasperAktywacja} `,
  },
  //0.04%
  {
    combination: [bell, bell, bar],
    multiplier: 220,
    message: `DWA DZWONECZKI I CZEKOLADKA ${oho} ${jasperAktywacja} `,
  },
  //0.05%
  {
    combination: [bar, bar, bar],
    multiplier: 180,
    message: `TRZY CZEKOLADKI ${okurwa} `,
  },
  //0.07
  {
    combination: [melon, melon, melon],
    multiplier: 130,
    message: `trzy arbuziki ${jasperBoobsy} `,
  },
  //0.18%
  {
    combination: [orange, orange, bar],
    multiplier: 50,
    message: `dwie pomarańczki i czekoladka ${oho} ${hm} `,
  },
  //0.21%
  {
    combination: [banana, banana, bar],
    multiplier: 42,
    message: `dwa bananki i czekoladka ${oho} ${oho} `,
  },
  //0.34%
  {
    combination: [bell, bell, bell],
    multiplier: 28,
    message: `trzy dzwoneczki ${hm} `,
  },
  //0.5%
  {
    combination: [orange, orange, orange],
    multiplier: 15,
    message: `trzy pomarańcze ${jasperAktywacja} `,
  },
  //0.87%
  {
    combination: [banana, banana, banana],
    multiplier: 10,
    message: `trzy banany ${jasperAktywacja} `,
  },
  //2.5%
  {
    combination: [cherry, cherry],
    multiplier: 6,
    message: `dwie wisienki ${oho} `,
  },
  //10%
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
