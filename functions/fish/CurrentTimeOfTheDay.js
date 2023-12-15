export default function CurrentTimeOfTheDay() {
    const currentHour = new Date().getHours();

    if (currentHour >= 10 && currentHour < 17) {
        return 'from10to17';
    } else if (currentHour >= 7 && currentHour < 10) {
        return 'from7to10';
    } else if ((currentHour >= 17 && currentHour < 21) || (currentHour >= 0 && currentHour < 7)) {
        return 'from17to21';
    } else if (currentHour >= 21) {
        return 'from21to7';
    } else {
        return 'from10to17';
    }
}