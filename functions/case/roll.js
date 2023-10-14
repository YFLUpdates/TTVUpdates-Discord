let random = (n) => Math.floor(Math.random() * n);

const rollItem = (data, rolledNumber) => {
  const { white, blue, purple, red, gold } = data;

  if (rolledNumber >= white.from && rolledNumber <= white.to) {
    return { rarity: "⬜", ...white.skins[random(white.skins.length)] };
  } else if (rolledNumber >= blue.from && rolledNumber <= blue.to) {
    return { rarity: "🟦", ...blue.skins[random(blue.skins.length)] };
  } else if (rolledNumber >= purple.from && rolledNumber <= purple.to) {
    return { rarity: "🟪", ...purple.skins[random(purple.skins.length)] };
  } else if (rolledNumber >= red.from && rolledNumber <= red.to) {
    return { rarity: "🟥", ...red.skins[random(red.skins.length)] };
  } else if (rolledNumber >= gold.from && rolledNumber <= gold.to) {
    return { rarity: "🟨", ...gold.skins[random(gold.skins.length)] };
  } else {
    return null;
  }
};
export default rollItem;
