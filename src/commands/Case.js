import { getPoints, pointsToVoid } from "@apis/TTVUpdates/index.js"
import { CreateItem } from "@apis/Inventory/index.js"
import ListOfCases from "@apis/Case/ListOfCases.js";

import { rollColor, rollItem, Qualities } from "@components/Case/index.js"
import PriceRolling from "@components/PriceRoll.js";
import { aha } from "@components/discordEmotes.js";

import { EmbedBuilder } from 'discord.js'

const checkClean = (arg) => {
  if (['lista', 'list', 'szansa', 'chance'].includes(arg)) {
    return null
  }

  return arg;
}
const cases = await ListOfCases();

export default async function commandCase(msg, argumentClean, args) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  if (['info'].includes(argumentClean) || !argumentClean) {
    const embed = new EmbedBuilder()
      .setColor(8086271)
      .setAuthor({ name: `Komenda - Case`, iconURL: `https://ttvu.link/logo512.png` })
      .setDescription('**Opis:** Otwieranie skrzynek')
      .setThumbnail(`https://ttvu.link/logo512.png`)
      .addFields(
        { name: `❯ Użycie komendy:`, value: `!case snake\n!case chance snake\n!case lista snake` },
        { name: `❯ Argumenty:`, value: `**Skrzynki:** snake, nightmare, riptide, cobble, huntsman, legend14, chall14.\n**Inne:** chance, szansa, lista, list` },
        { name: `❯ Aliasy:`, value: `!skrzynka, !skrzynia, !crate` }
      )
      .setImage(`https://ttvu.link/og-default.png`)
      .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
      .setTimestamp()

    return { embeds: [embed] };
  }

  if (["szansa", "chance"].includes(argumentClean)) {
    if (args.length < 2 || !args[1]) {
      return `<@${discordID}>, zapomniałeś/aś o nazwie skrzynki: nightmare, riptide, snake, cobble, huntsman, legend14, chall14.`;
    }

    const nameCase = args[1];

    if (["nightmare", "riptide", "snake", "huntsman"].includes(nameCase)) {
      return `<@${discordID}>, Szansa na drop - ${nameCase}: ⬜ [55.23%], 🟦 [25.44%], 🟪 [10.68%], 🟥 [7.29%], 🟨 [1.33%]`;
    }
    else if (["cobble"].includes(nameCase)) {
      return `<@${discordID}>, Szansa na drop - ${nameCase}: ⬜ [57.2%], 🟦 [26.64%], 🟪 [13.87%], 🟥 [1.97%], 🟨 [0.32%]`;
    }
    else if (["legend14", "chall14"].includes(nameCase)) {
      return `<@${discordID}>, Szansa na drop - ${nameCase}: 🟦 [71.93%], 🟪 [1.52%], 🟥 [26.55%]`;
    }
  }


  if (["lista", "list", "info"].includes(argumentClean)) {
    if (args.length < 2 || !args[1]) {
      return `<@${discordID}>, zapomniałeś/aś o nazwie skrzynki: nightmare, riptide, snake, cobble, huntsman, legend14, chall14.`;
    }

    const nameCase = args[1]

    if (["nightmare", "riptide", "snake", "huntsman", "cobble", "legend14", "chall14"].includes(nameCase)) {
      return `<@${discordID}>, Lista skinów ${nameCase}: https://ttvu.link/dashboard/cases/${nameCase}`
    }
  }

  if (!cases) {
    return `<@${discordID}>, nie udało sie pobrać danych o skrzynce`;
  }
  
  const data = cases[checkClean(argumentClean) || args[1]];

  if (!["nightmare", "riptide", "snake", "cobble", "huntsman", "legend14", "chall14"].includes(argumentClean)) {
    return `<@${discordID}>, Nie jesteśmy w stanie rozpoznać tej skrzynki.`;
  }

  const userInfo = await getPoints(discordID, "adrian1g__");

  if (userInfo === null || userInfo.points === null) {
    return `<@${discordID}>, najprawdopodobniej nie połączyłeś konta. Zrób to za pomoca wpisania ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
  }

  if (data.cost > userInfo.points) {
    return `<@${discordID}>, nie masz tylu punktów, skrzynka ${argumentClean} kosztuje ${data.cost} punktów ${aha} (masz ${userInfo.points} pkt)`;
  }

  const rolledNumber = await rollColor();
  const skin = rollItem(data, rolledNumber);
  if (skin === null) {
    return `<@${discordID}>, błąd podczas losowania przedmiotu.`;
  }

  const updatePoints = await pointsToVoid(
    "adrian1g__",
    `-${data.cost}`,
    userInfo.user_login
  );

  if (updatePoints === null) {
    return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika. `;
  }

  const itemPrice = PriceRolling(skin.min_price, skin.max_price);
  const Quality = Qualities(itemPrice, skin.min_price, skin.max_price);
  const addItem = await CreateItem(user, `[${skin.rarity}] ${skin.name} ${Quality}`, itemPrice, skin.image, "adrian1g__")

  if (addItem === null) {
    return `<@${discordID}>, błąd podczas dodawania przedmiotu, skontaktuj się z administratorem.`;
  }

  const embed = new EmbedBuilder()
    .setColor(8086271)
    .setAuthor({ name: userInfo.user_login, iconURL: `https://cdn.discordapp.com/avatars/${discordID}/${msg.author.avatar}.png?size=256` })
    .setDescription(`Wylosowałeś/aś **${skin.name}**`)
    .addFields(
      { name: `❯ Rzadkość: `, value: `${skin.rarity}` },
      { name: `❯ Cena: `, value: `$${itemPrice}` },
      { name: `❯ Jakość: `, value: `${Quality}` }
    )
    .setImage(skin.image)
    .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
    .setTimestamp();

  return { embeds: [embed] };
}
