import getPoints from "../requests/getPoints.js";
import {cases} from "../functions/case/data/caseData.js";
import rollColor from "../functions/case/skin.js";
import rollItem from "../functions/case/roll.js";
import gambleUpdate from "../requests/gambleUpdate.js";
import CreateItem from "../requests/CreateItem.js";

export default async function commandCase(msg, argumentClean, args) {
  const gambleChannel = "1083102450472468480";

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

  if (!argumentClean) {
    return `<@${discordID}>, Dostępne skrzynki: nightmare, riptide, snake, cobble, huntsman. Drop pod: szansa (np. !case chance snake).`;
  }

  if (["szansa", "chance"].includes(argumentClean)) {
    if (args.length < 2 || !args[1]) {
      return `<@${discordID}>, zapomniałeś/aś o nazwie skrzynki: nightmare, riptide, snake, cobble, huntsman.`;
    }

    const nameCase = args[1];

    if (["nightmare", "riptide", "snake", "cobble", "huntsman"].includes(nameCase)) {
      return `<@${discordID}>, Szansa na drop: ⬜ [56%], 🟦 [26%], 🟪 [13%], 🟥 [4%], 🟨 [1%]`;
    }
    // else if ("cobble".includes(nameCase)) {
    //   return `<@${discordID}>, Szansa na drop: ⬜ [56%], 🟦 [26%], 🟪 [13%], 🟥 [4%], 🟨 [1%]`;
    // }
  }

  if (!["nightmare", "riptide", "snake", "cobble", "huntsman"].includes(argumentClean)) {
    return `<@${discordID}>, Nie jesteśmy w stanie rozpoznać tej skrzynki.`;
  }

  const data = cases[argumentClean];
  const points = await getPoints(discordID, "adrian1g__");

  if (points === null || points.points === null) {
    return `<@${discordID}>, najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale adrian1g__`;
  }

  if (data.cost > points.points) {
    return `<@${discordID}>,  nie masz tylu punktów, skrzynka ${argumentClean} kosztuje ${data.cost} punktów aha `;
  }

  const rolledNumber = await rollColor();
  const skin = rollItem(data, rolledNumber);

  if (skin === null) {
    return `<@${discordID}>, błąd podczas losowania przedmiotu.`;
  }

  const updatePoints = await gambleUpdate(
    "adrian1g__",
    `-${data.cost}`,
    points.user_login
  );

  if (updatePoints === null) {
    return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika. `;
  }

  const addItem = await CreateItem(
    points.user_login,
    `[${skin.rarity}] ${skin.name}`,
    skin.price,
    skin.image,
    "adrian1g__",
  )

  if (addItem === null) {
    return `<@${discordID}>, błąd podczas dodawania przedmiotu, skontaktuj się z administratorem.`;
  }

  return `<@${discordID}>, Wylosowałeś/aś: [${skin.rarity}] ${skin.name} (Ekwipunek: !eq)`;
}