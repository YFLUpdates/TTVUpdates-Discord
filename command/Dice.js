import multiplyDice from "../functions/multiplyDice.js";
import rollDice from "../functions/rollDice.js";
import { aha, fire, jasperAktywacja, jasperBoobsy, jasperSmiech, okurwa } from "../functions/slots/data/discordEmotes.js";
import gambleUpdate from "../requests/gambleUpdate.js";
import getPoints from "../requests/getPoints.js";

import { EmbedBuilder } from "discord.js";

export default async function commandDice(msg, argumentClean) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  if(["info"].includes(argumentClean)) {
    const embed = new EmbedBuilder()
      .setColor(8086271)
      .setAuthor({ name: `Komenda - Dice`, iconURL: `https://ttvu.link/logo512.png`})
      .setDescription('**Opis:** Rzuć kostkami o punkty')
      .setThumbnail(`https://ttvu.link/logo512.png`)
      .addFields(
      { name: `❯ Użycie komendy:`, value: `!dice 100` },
      { name: `❯ Argumenty:`, value: `kwota` },
      { name: `❯ Aliasy:`, value: `!kosci` },
      )
      .setImage(`https://ttvu.link/og-default.png`)
      .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
      .setTimestamp();
  
    return msg.channel.send({ embeds: [embed] });
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
    return `<@${discordID}> najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
  }

  if (Number(argumentClean) > points.points) {
    return `<@${discordID}> nie masz tylu punktów ${aha} (masz ${points.points} pkt)`
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