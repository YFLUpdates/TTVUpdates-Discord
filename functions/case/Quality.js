const GetQuality = (price, maxPrice) => {
    const percent = Math.floor((price / maxPrice) * 100)

    if(percent >= 0 && percent <= 55) {
        return '[BS]'
    } else if(percent > 55 && percent <= 63) {
        return '[WW]'
    } else if(percent > 63 && percent <= 85) {
        return '[FT]'
    } else if(percent > 85 && percent <= 93) {
        return '[MW]'
    } else if(percent > 93 && percent < 100) {
        return '[FN]'
    } else {
        return '' // price === maxPrice
    }
}
export default GetQuality