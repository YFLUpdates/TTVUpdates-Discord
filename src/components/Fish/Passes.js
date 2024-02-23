export default function fishingPasses(pass) {
    const currentDate = new Date();

    switch (pass) {
        case "30min":
            return {
                prices: {
                    ground_rod_t1: 400,
                    ground_rod_t2: 550,
                    ground_rod_t3: 800,
                    spinning_rod_t1: 550,
                    spinning_rod_t2: 800,
                    spinning_rod_t3: 1000
                },
                date: new Date(currentDate.getTime() + (30 * 60 * 1000))
            }
        case "1hour":
            return {
                prices: {
                    ground_rod_t1: 700,
                    ground_rod_t2: 925,
                    ground_rod_t3: 1500,
                    spinning_rod_t1: 925,
                    spinning_rod_t2: 1500,
                    spinning_rod_t3: 1900
                },
                date: new Date(currentDate.getTime() + (1 * 60 * 60 * 1000))
            };
        case "2hour":
            return {
                prices: {
                    ground_rod_t1: 1300,
                    ground_rod_t2: 1750,
                    ground_rod_t3: 2800,
                    spinning_rod_t1: 1750,
                    spinning_rod_t2: 2800,
                    spinning_rod_t3: 3800
                },
                date: new Date(currentDate.getTime() + (2 * 60 * 60 * 1000))
            };
        default:
            return {
                prices: {
                    ground_rod_t1: 400,
                    ground_rod_t2: 550,
                    ground_rod_t3: 800,
                    spinning_rod_t1: 550,
                    spinning_rod_t2: 800,
                    spinning_rod_t3: 1000
                },
                date: new Date(currentDate.getTime() + (30 * 60 * 1000))
            };
    }
}