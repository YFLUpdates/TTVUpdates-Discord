export default function FishPriceRolling(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}