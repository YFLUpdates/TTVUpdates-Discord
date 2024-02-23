export default function Qualities(rolledNumber, minNumber, maxNumber) {
    if(minNumber === maxNumber){
        return "";
    }

    // Calculate the range between min and max numbers
    let rangeSize = maxNumber - minNumber;

    // Calculate the thresholds for each title based on the percentage
    let sevenPercentThreshold = maxNumber - 0.07 * rangeSize;
    let eightPercentThreshold = maxNumber - 0.15 * rangeSize;
    let twentyTwoPercentThreshold = maxNumber - 0.37 * rangeSize;
    let eightyPercentThreshold = minNumber + 0.45 * rangeSize;

    // Check which title corresponds to the rolled number
    if (rolledNumber >= sevenPercentThreshold) {
        return "[FN]";
    } else if (rolledNumber >= eightPercentThreshold) {
        return "[MW]";
    } else if (rolledNumber >= twentyTwoPercentThreshold) {
        return "[FT]";
    } else if (rolledNumber >= eightyPercentThreshold) {
        return "[WW]";
    } else {
        return "[BS]";
    }
}