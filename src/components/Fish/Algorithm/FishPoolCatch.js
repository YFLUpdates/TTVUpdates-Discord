let random = (n) => Math.floor(Math.random() * n);

export default function FishPoolCatch(data, fishing_rod, rolledNumber, drops) {
    const { very_low, low, medium, high, very_high } = data.pools;

    if (rolledNumber >= very_low.percentage[fishing_rod].from && rolledNumber <= very_low.percentage[fishing_rod].to) {
        return { rarity: "⬜", ...drops.very_low[random(drops.very_low.length)] };
    } else if (rolledNumber >= low.percentage[fishing_rod].from && rolledNumber <= low.percentage[fishing_rod].to) {
        return { rarity: "🟩", ...drops.low[random(drops.low.length)] };
    } else if (rolledNumber >= medium.percentage[fishing_rod].from && rolledNumber <= medium.percentage[fishing_rod].to) {
        return { rarity: "🟦", ...drops.medium[random(drops.medium.length)] };
    } else if (rolledNumber >= high.percentage[fishing_rod].from && rolledNumber <= high.percentage[fishing_rod].to) {
        return { rarity: "🟪", ...drops.high[random(drops.high.length)] };
    } else if (rolledNumber >= very_high.percentage[fishing_rod].from && rolledNumber <= very_high.percentage[fishing_rod].to) {
        return { rarity: "🟧", ...drops.very_high[random(drops.very_high.length)] };
    } else {
        return null;
    }
};
