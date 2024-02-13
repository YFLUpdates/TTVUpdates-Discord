export default function SkinPriceRoll(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}