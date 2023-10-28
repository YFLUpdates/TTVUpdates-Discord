import getPoints from "../requests/getPoints.js";
import duelUpdate from "../requests/duelUpdate.js";
import rollingNumber from "../functions/duel/rollingNumber.js"
import Truncate from "../functions/duel/Truncate.js";


export default async function commandDuel(msg, argumentClean, args, session_settings) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  const duelsList = session_settings[`adrian1g__`].duels_list

  if (["accept", "akceptuje", "akceptuj"].includes(argumentClean)) {
    const duelCreator = args[1]
      ? args[1].replaceAll("@", "").toLowerCase()
      : null;

    if (!args[1] || duelCreator === null || discordID === args[1]) {
      return `<@${discordID}>, zapomniałeś podać osobe TPFufun `;
    }
    const indexOfObject = duelsList.findIndex((object) => {
      return object.id === `${duelCreator}-${discordID}`;
    });

    if (indexOfObject === -1) {
      return `<@${discordID}>, taki pojedynek nie istnieje mhm `;
    }
    const duelInfo = session_settings[`adrian1g__`].duels_list[indexOfObject];

    if (duelInfo.expires < new Date()) {
      duelsList.splice(indexOfObject, 1);

      return `<@${discordID}>, pojedynek wygasł :( `;
    }

    const userInfo = await getPoints(discordID, "adrian1g__");
    const duelCreatorData = userData(duelCreator, "adrian1g__");

    if(!userInfo || !duelCreatorData){
      return `<@${discordID}>, nie udało sie pobrać danych osób z pojedynku.`;
    }

    if (duelInfo.points > userInfo.points) {
      duelsList.splice(indexOfObject, 1);

      return `@${duelCreator}, nie posiadasz tylu punktów mhm`;
    }

    if (duelInfo.points > duelCreatorData.points) {
      duelsList.splice(indexOfObject, 1);

      return `@${duelCreator}, nie posiada już punktów mhm`;
    }

    duelsList.splice(indexOfObject, 1);
    const rolledNumber = await rollingNumber();

    if (rolledNumber === 1) {
      const request = duelUpdate("adrian1g__", {
        points: duelInfo.points,
        winner: duelInfo.discordID,
        loser: duelInfo.invited,
      });

      if (request === null) {
        return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika. `;
      }

      return `@${duelInfo.discordID}, wygrałeś/aś pojedynek z @${
        duelInfo.invited
      }, zakład wynosił ${duelInfo.points * 2} punktów `;
    }

    const request = duelUpdate("adrian1g__", {
      points: duelInfo.points,
      winner: duelInfo.invited,
      loser: duelInfo.discordID,
    });

    if (request === null) {
      return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika. `;
    }

    return `@${duelInfo.invited}, wygrałeś/aś pojedynek z ${
      duelInfo.discordID
    }, zakład wynosił ${duelInfo.points * 2} punktów `;
  }

  if (["list", "lista"].includes(argumentClean)) {
    if (cooldown.classic > Date.now() - cooldownsList("classic")) {
      return null;
    }
    cooldown.classic = Date.now();

    const makeShort = Truncate(duelsList.map((i) => i.id).join(", "), 200);

    return `Aktualne pojedynki: ${makeShort.length === 0 ? "Brak" : makeShort}`;
  }

  if (cooldown.longer > Date.now() - cooldownsList("longer")) {
    return null;
  }
  cooldown.longer = Date.now();

  if (modules.modules["duels"] === false)
    return `<@${discordID}>, pojedynki zostały wyłączone. `;

  if (!argumentClean || argumentClean === discordID) {
    return `<@${discordID}>, zapomniałeś podać osobe `;
  }

  if (!args[1]) {
    return `<@${discordID}>, zapomniałeś/aś o kwocie `;
  }

  const betPoints = Number(args[1]);

  if (betPoints > 300000000 || betPoints <= 0 || isNaN(args[1])) {
    return `<@${discordID}>, maksymalnie można obstawić 5000 punktów `;
  }

  const userInfo = await userData(discordID, "adrian1g__");

  if (betPoints > userInfo.points) {
    return `<@${discordID}> nie masz tylu punktów aha `;
  }

  const indexOfObject = duelsList.findIndex((object) => {
    return object.id === `<@${discordID}>-${argumentClean}`;
  });

  if (indexOfObject !== -1) {
    return `<@${discordID}> taki pojedynek już istnieje `;
  }

  duelsList.push({
    id: `<@${discordID}>-${argumentClean}`,
    user: discordID,
    invited: argumentClean,
    points: betPoints,
    expires: new Date(+new Date() + 60000 * 2),
  });

  return `@${argumentClean}, jeśli akceptujesz pojedynek na kwotę ${betPoints} punktów, wpisz !duel accept <@${discordID}>`;
}