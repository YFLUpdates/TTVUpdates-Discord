export default function FishCatch(data, fishing_rod, rolledNumber) {
    const { percentage } = data;

    if (rolledNumber >= percentage[fishing_rod].from && rolledNumber <= percentage[fishing_rod].to) {
        return true;
    } else {
        return null;
    }
};
