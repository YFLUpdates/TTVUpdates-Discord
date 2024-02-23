export default function RodsList(rod) {
    switch (rod) {
        case "ground_rod_t1":
            return {
                title: "Standardowa Wędeczka"
            }
        case "ground_rod_t2":
            return {
                title: "Dobra Wędka taktak"
            };
        case "ground_rod_t3":
            return {
                title: "Giga Wędunia"
            };
        case "spinning_rod_t1":
            return {
                title: "Lepsza Standardowa Wędeczka"
            };
        case "spinning_rod_t2":
            return {
                title: "Bardzo Dobra Wędka taktak"
            };
        case "spinning_rod_t3":
            return {
                title: "Mega Giga Wędunia"
            };
        default:
            return null;
    }
}