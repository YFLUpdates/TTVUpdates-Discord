export default function RodUpgrade(currentRod) {
    if (!currentRod) {
        return "ground_rod_t1";
    }

    // Define the upgrade hierarchy
    const upgrades = {
        ground_rod_t1: 'spinning_rod_t1',
        spinning_rod_t1: 'ground_rod_t2',
        ground_rod_t2: 'spinning_rod_t2',
        spinning_rod_t2: 'ground_rod_t3',
        ground_rod_t3: 'spinning_rod_t3',
        spinning_rod_t3: 'no_further_upgrade' // No further upgrade, as it is the best rod
    };

    // Check if the current rod is in the upgrades hierarchy
    if (upgrades.hasOwnProperty(currentRod)) {
        return upgrades[currentRod];
    } else {
        return null;
    }
}