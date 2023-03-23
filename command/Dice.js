import multiplyDice from "../functions/multiplyDice.js";
import rollDice from "../functions/rollDice.js";
import { aha, fire, jasperAktywacja, jasperBoobsy, jasperSmiech, okurwa } from "../functions/slots/data/discordEmotes.js";
import gambleUpdate from "../requests/gambleUpdate.js";
import getPoints from "../requests/getPoints.js";

export default async function commandDice(msg, argumentClean){
    const gambleChannel = "1083102450472468480";

    if (msg.channelId !== gambleChannel) {
      return null;
    }
    
    const discordID = msg.author.id;

    if (argumentClean === "info") {
      return `<@${discordID}>, proste kosteczki działające na zasadzie podzielności **->**\nJeśli wynik trzech kostek jest podzielny przez dwa - Wygrywasz **x2**\nJeśli trafisz trzy szóstki - Wygrywasz **x66**\nJeśli trafisz trzy trójki - Wygrywasz **x33**\nAutor ten pierwszy i najlepszy programista - xan ${jasperBoobsy}`;
    }

    if (argumentClean === "procenty") {
        return `<@${discordID}>\nWygrana x2 - **25%**\nWygrana x33 - **0.46%**\nWygrana x66 - **0.46%**`;
    }
      const points = await getPoints(discordID, "adrian1g__");
  
      if (!argumentClean) {
        return `<@${discordID}>, zapomniałeś/aś o kwocie `;
      }
  
      if (Number(argumentClean) > 5000 || Number(argumentClean) <= 0 || isNaN(argumentClean)) {
        return `<@${discordID}>, maksymalnie można obstawić 5000 punktów `;
      }
  
      if (points === null || points.points === null) {
        return `<@${discordID}> najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc "+discordID+"`"} na kanale adrian1g__`;
      }
  
      if (Number(argumentClean) > points.points) {
        return `<@${discordID}> nie masz tylu punktów ${aha} `
      }
  
      const dice1 = await rollDice();
      const dice2 = await rollDice();
      const dice3 = await rollDice();
      const betPoints = Number(argumentClean);
      const multiplyAmount = multiplyDice(dice1, dice2, dice3);
  
      if (multiplyAmount === null) {
        const updatePoints = await gambleUpdate("adrian1g__", `-${betPoints}`, points.user_login);
  
        if (updatePoints === null) {
          return `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów ${aha}`;
        }
  
        return `<@${discordID}> przegrałeś/aś wszystko ${jasperSmiech} - 🎲${dice1} 🎲${dice2} 🎲${dice3}`
      }
  
      const winAmount = betPoints * multiplyAmount;
      const updatePoints = await gambleUpdate("adrian1g__", `+${winAmount - betPoints}`, points.user_login);
  
      if (updatePoints === null) {
        return `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów ${aha} `;
      }
  
      if (multiplyAmount === 66) {
        return `<@${discordID}> szatańska wygrana ${new Intl.NumberFormat('pl-PL').format(winAmount)} ${okurwa} ${fire} x66 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `;
      }
  
      if (multiplyAmount === 33) {
        return `<@${discordID}> szczęśliwa trójka ${new Intl.NumberFormat('pl-PL').format(winAmount)} ${jasperAktywacja} 🍀 🍀 x33 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `;
      }
  
      return `<@${discordID}> wygrałeś/aś ${new Intl.NumberFormat('pl-PL').format(winAmount)} punktów ${okurwa} - 🎲${dice1} 🎲${dice2} 🎲${dice3}`;
}