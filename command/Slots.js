import { aha } from "../functions/slots/data/discordEmotes.js";
import { slotsInfo, slotsPercentage } from "../functions/slots/data/slotsData.js";
import { runSlots } from "../functions/slots/slots.js";
import gambleUpdate from "../requests/gambleUpdate.js";
import getPoints from "../requests/getPoints.js";

export default async function commandSlots(msg, argumentClean) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  if (!argumentClean) {
    return `<@${discordID}>, zapomniałeś/aś o kwocie `;
  }

  if (argumentClean === "info") {
		return `<@${discordID}>, ${slotsInfo}`;
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
    return `<@${discordID}> najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
  }

  if (betPoints > points.points) {
    return `<@${discordID}> nie masz tylu punktów ${aha} `;
  }

  const outcome = runSlots(betPoints);
  const finalPointsResult = outcome.totalWin - betPoints;
  let updatePoints;

  if (finalPointsResult <= 0) {
    updatePoints = await gambleUpdate(
      "adrian1g__",
      `-${betPoints}`,
      points.user_login
    );
  } else {
    updatePoints = await gambleUpdate(
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