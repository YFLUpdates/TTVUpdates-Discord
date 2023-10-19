import getPoints from "../requests/getPoints.js";
import {rollColor, multiplyColor, emojiColor } from "../functions/roulette/index.js";
import gambleUpdate from "../requests/gambleUpdate.js";
import { beka, fire, jasperBoobsy, okurwa, aha } from "../functions/slots/data/discordEmotes.js";

export default async function commandRoulette(msg, argumentClean, args){
    const gambleChannel = process.env.GAMBLE_CHANNEL;

    if (msg.channelId !== gambleChannel) {
      return null;
    }

    const discordID = msg.author.id;

    if (argumentClean === "info") {
        return `<@${discordID}>, prosta ruletka z pięcioma kolorami **->**\nJeśli postawisz na czarny lub czerwony - Wygrywasz **x2**\nJeśli postawisz na niebieski - Wygrywasz **x3**\nJeśli postawisz na pomarańczowy - Wygrywasz **x5**\nJeśli postawisz na zielony - Wygrywasz **x14**\nAutor ten pierwszy i najlepszy programista - xan ${jasperBoobsy}`;
    }

    if (argumentClean === "procenty") {
        return `<@${discordID}>\nCzarny, Czerwony - **38%**\nNiebieski - **22%**\nPomarańczowy - **5%**\nZielony - **5%**`;
    }

    if(!argumentClean || !["red", "black", "green", "blue", "orange"].includes(argumentClean)){
       return `<@${discordID}>, zapomniałeś/aś o kolorze red - **(x2)**, black - **(x2)**, blue - **(x3)**, orange - **(x5)**, green - **(x14)** `; 
    } 

    if(!args[1]){
        return `<@${discordID}>, zapomniałeś/aś o kwocie `; 
    }

    if(Number(args[1]) > 5000 || Number(args[1]) <= 0 || isNaN(args[1])){
        return `<@${discordID}>, maksymalnie można obstawić 5000 punktów `; 
    }

    const points = await getPoints(discordID, "adrian1g__");
    
    if (points === null || points.points === null) {
        return `<@${discordID}>, najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc "+discordID+"`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
    }

    if (Number(args[1]) > points.points) {
        return `<@${discordID}>, nie masz tylu punktów ${aha} `
    }

    const winnerColor = await rollColor();
    const betPoints = Number(args[1]);

    if(winnerColor !== argumentClean){
        const updatePoints = await gambleUpdate("adrian1g__", `-${betPoints}`, points.user_login);

        if (updatePoints === null) {
            return `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów ${aha}`;
        }

        return `<@${discordID}> przegrałeś/aś wszystko ${beka} - ${emojiColor(winnerColor)}`;
    }

    const winAmount = (betPoints * multiplyColor(winnerColor));
    const updatePoints = await gambleUpdate("adrian1g__", `+${winAmount - betPoints}`, points.user_login);

    if (updatePoints === null) {
        return `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów ${aha}`;
    }

    return `<@${discordID}> wygrałeś/aś ${winAmount} punktów ${okurwa} ${fire} `;
}
