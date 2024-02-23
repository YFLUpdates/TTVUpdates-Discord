import { getPoints, getUserTwitch, duelUpdate } from "@apis/TTVUpdates/index.js"

import rollingNumber from "@components/Duel/rollingNumber.js"
import Truncate from "@components/Truncate.js";

import { EmbedBuilder } from "discord.js";

export default async function commandDuel(msg, argumentClean, args, duels_list) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  if (["info"].includes(argumentClean)) {
    const embed = new EmbedBuilder()
      .setColor(8086271)
      .setAuthor({ name: `Komenda - Duel`, iconURL: `https://ttvu.link/logo512.png` })
      .setDescription('**Opis:** Zaproś na pojedynek o punkty')
      .setThumbnail(`https://ttvu.link/logo512.png`)
      .addFields(
        { name: `❯ Użycie komendy:`, value: `!duel 3xanax 100\n!duel list` },
        { name: `❯ Argumenty:`, value: `user, list, kwota` },
        { name: `❯ Aliasy:`, value: `!pojedynek` },
      )
      .setImage(`https://ttvu.link/og-default.png`)
      .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
      .setTimestamp();

    return { embeds: [embed] };
  }

  const duelsList = duels_list;

  if (["accept", "akceptuje", "akceptuj"].includes(argumentClean)) {
    const duelCreator = args[1] ? args[1].toLowerCase() : null;

    if (!args[1] || duelCreator === null) {
      return `<@${discordID}>, zapomniałeś podać osobe TPFufun `;
    }

    const userInfo = await getPoints(discordID, "adrian1g__");
    if (!userInfo || userInfo.user_login === args[1]) {
      return `<@${discordID}>, nie udało sie pobrać danych.`;
    }

    const indexOfObject = duelsList.findIndex((object) => {
      return object.id === `${duelCreator}-${userInfo.user_login}`;
    });

    if (indexOfObject === -1) {
      return `<@${discordID}>, taki pojedynek nie istnieje mhm `;
    }

    const duelInfo = duels_list[indexOfObject];

    if (duelInfo.expires < new Date()) {
      duelsList.splice(indexOfObject, 1);

      return `<@${discordID}>, pojedynek wygasł :( `;
    }

    const duelCreatorData = getUserTwitch(duelCreator, "adrian1g__");

    if (!duelCreatorData) {
      return `<@${discordID}>, nie udało sie pobrać danych osoby która założyła pojedynek.`;
    }

    if (duelInfo.points > userInfo.points) {
      duelsList.splice(indexOfObject, 1);

      return `<@${discordID}>, nie posiadasz tylu punktów mhm`;
    }

    if (duelInfo.points > duelCreatorData.points) {
      duelsList.splice(indexOfObject, 1);

      return `${duelCreator}, nie posiada już punktów mhm`;
    }

    duelsList.splice(indexOfObject, 1);
    const rolledNumber = await rollingNumber();

    if (rolledNumber === 1) {
      const request = duelUpdate("adrian1g__", {
        points: duelInfo.points,
        winner: duelInfo.user,
        loser: duelInfo.invited,
      });

      if (request === null) {
        return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika. `;
      }

      return `${duelInfo.user}, wygrałeś/aś pojedynek z ${duelInfo.invited
        }, zakład wynosił ${duelInfo.points * 2} punktów `;
    }

    const request = duelUpdate("adrian1g__", {
      points: duelInfo.points,
      winner: duelInfo.invited,
      loser: duelInfo.user,
    });

    if (request === null) {
      return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika. `;
    }

    return `${duelInfo.invited}, wygrałeś/aś pojedynek z ${duelInfo.user
      }, zakład wynosił ${duelInfo.points * 2} punktów `;
  }

  if (["list", "lista"].includes(argumentClean)) {

    const makeShort = Truncate(duelsList.map((i) => i.id).join(", "), 200);

    return `Aktualne pojedynki: ${makeShort.length === 0 ? "Brak" : makeShort}`;
  }

  if (!argumentClean || argumentClean === discordID) {
    return `<@${discordID}>, zapomniałeś podać osobe `;
  }

  if (!args[1]) {
    return `<@${discordID}>, zapomniałeś/aś o kwocie `;
  }

  const betPoints = Number(args[1]);

  if (betPoints <= 0 || isNaN(args[1])) {
    return `<@${discordID}>, minimalnie można walczyć o 1 punkt. `;
  }

  const userInfo = await getPoints(discordID, "adrian1g__");
  const duoInfo = await getPoints(argumentClean, "adrian1g__")

  if (betPoints > duoInfo.points) {
    return `<@${discordID}>, @${duoInfo.user_login} nie ma tylu punktów aha`
  }

  if (betPoints > userInfo.points) {
    return `<@${discordID}> nie masz tylu punktów aha `;
  }

  const indexOfObject = duelsList.findIndex((object) => {
    return object.id === `${userInfo.user_login}-${argumentClean}`;
  });

  if (indexOfObject !== -1) {
    return `<@${discordID}> taki pojedynek już istnieje `;
  }

  duelsList.push({
    id: `${userInfo.user_login}-${argumentClean}`,
    user: userInfo.user_login,
    invited: argumentClean,
    points: betPoints,
    expires: new Date(+new Date() + 60000 * 2),
  });

  return `${argumentClean}, jeśli akceptujesz pojedynek na kwotę ${betPoints} punktów, wpisz !duel accept ${userInfo.user_login}`;
}