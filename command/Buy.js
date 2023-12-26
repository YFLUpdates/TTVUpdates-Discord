import { aha, fire, mhm, okurwa } from "../functions/slots/data/discordEmotes.js";
import gambleUpdate from "../requests/gambleUpdate.js";
import getPoints from "../requests/getPoints.js";

const roleNameList = (type) => {
  if (type === "hazardzista") {
    return "hazardzista";
  }

  if (type === "rybkarz") {
    return "rybkarz";
  }

  return null;
}

export default async function commandBuy(msg, argumentClean) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  if (!argumentClean || !["hazardzista", "rybkarz"].includes(argumentClean)) {
    return `<@${discordID}>, dostępne produkty: **hazardzista** - 1mln, **rybkarz** - 1mln`;
  }

  const points = await getPoints(discordID, "adrian1g__");

  if (points === null || points.points === null) {
    return `<@${discordID}>, najprawdopodobniej nie połączyłeś konta. Zrób to za pomoca wpisania ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
  }

  if (1000000 > points.points) {
    return `<@${discordID}> nie masz wystarczającej liczby punktów ${aha}`;
  }

  const specialRoleName = roleNameList(argumentClean);
  if (!specialRoleName) {
    return `<@${discordID}>, dostępne produkty: **hazardzista** - 1mln, **rybkarz** - 1mln`;
  }

  if (msg.member.roles.cache.some(r => r.name === specialRoleName)) {
    return `<@${discordID}> posiadasz już te rangę! ${mhm}`;
  }

  const updatePoints = await gambleUpdate("adrian1g__", `-1000000`, points.user_login);

  if (updatePoints === null) {
    return `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów ${aha}`;
  }

  let role = msg.guild.roles.cache.find(r => r.name === specialRoleName);
  msg.member.roles.add(role).catch(console.error);

  return `Gratulacje <@${discordID}>! zakupiłeś range ${argumentClean.toUpperCase()} ${okurwa} ${fire}`;
}