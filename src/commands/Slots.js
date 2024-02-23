import { pointsToVoid, getPoints } from "@apis/TTVUpdates/index.js"

import { slotsInfo, slotsPercentage } from "@components/Slots/data/slotsData.js";
import { runSlots } from "@components/Slots/slots.js";
import { aha } from "@components/discordEmotes.js";

import { EmbedBuilder } from "discord.js";

export default async function commandSlots(msg, argumentClean) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  if (!argumentClean) {
    return `<@${discordID}>, zapomniałeś/aś o kwocie `;
  }

  if (argumentClean === "oginfo") {
		return `<@${discordID}>, ${slotsInfo}`;
	}

  if (['info'].includes(argumentClean)) {
    const embed = new EmbedBuilder()
      .setColor(8086271)
      .setAuthor({ name: `Komenda - Slots`, iconURL: `https://ttvu.link/logo512.png` })
      .setDescription('**Opis:** Proste slotsy na 3 rolki')
      .setThumbnail(`https://ttvu.link/logo512.png`)
      .addFields(
        { name: `❯ Użycie komendy:`, value: `!slots 100\n!slots procenty` },
        { name: `❯ Argumenty:`, value: `kwota, procenty` },
        { name: `❯ Aliasy:`, value: `!slot, !sloty` }
      )
      .setImage(`https://ttvu.link/og-default.png`)
      .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
      .setTimestamp()

    return { embeds: [embed] };
  }

  if (argumentClean === "procenty") {
    return `<@${discordID}>, ${slotsPercentage}`;
  }

  const betPoints = Number(argumentClean);
  if (betPoints > 20000 || betPoints <= 0 || !betPoints) {
    return `<@${discordID}>, maksymalnie można obstawić 20000 punktów `;
  }

  const points = await getPoints(discordID, "adrian1g__");

  if (points === null || points.points === null) {
    return `<@${discordID}>, najprawdopodobniej nie połączyłeś konta. Zrób to za pomoca wpisania ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
  }

  if (betPoints > points.points) {
    return `<@${discordID}> nie masz tylu punktów ${aha} `;
  }

  const outcome = runSlots(betPoints);
  const finalPointsResult = outcome.totalWin - betPoints;
  let updatePoints;

  if (finalPointsResult <= 0) {
    updatePoints = await pointsToVoid(
      "adrian1g__",
      `-${betPoints}`,
      points.user_login
    );
  } else {
    updatePoints = await pointsToVoid(
      "adrian1g__",
      `+${finalPointsResult}`,
      points.user_login
    );
  }

  if (updatePoints === null) {
    return `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów ${aha}`;
  }

  return `<@${discordID}>, ${outcome.message}`;
}