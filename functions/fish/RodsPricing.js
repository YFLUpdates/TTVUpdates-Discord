export default function RodsPricing(rod) {
    switch (rod) {
        case "ground_rod_t1":
            return {
                price: 2800
            }
        case "ground_rod_t2":
            return {
                price: 3300
            };
        case "ground_rod_t3":
            return {
                price: 4300
            };
        case "spinning_rod_t1":
            return {
                price: 3300
            };
        case "spinning_rod_t2":
            return {
                price: 4300
            };
        case "spinning_rod_t3":
            return {
                price: 5300
            };
        default:
            return null;
    }
}