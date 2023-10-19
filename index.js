import { Client, EmbedBuilder, GatewayIntentBits, ActivityType } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import { Dice, Buy, Slots, Zglos, Points, Roulette, Case, Inventory } from "./command/index.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const app = express();
const PORT = process.env.PORT || 3000;
let cooldown = 0;
let cooldownSpecial = 0;

app.set("json spaces", 2);
app.use(express.json());

app.use((req, res, next) => {
  res.status(404).json({
    message: `Route ${req.method}:${req.url} not found`,
    error: "Not Found",
    statusCode: 404,
  });
});

app.listen(PORT, () => console.log(`API Server listening on port ${PORT}`));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)

  const statusArray = [
    {
      content: 'ttvu.link',
      type: ActivityType.Playing,
      url: 'https://ttvu.link'
    },
    {
      content: 'buycoffee.to/docchi',
      type: ActivityType.Competing,
      url: 'https://buycoffee.to/docchi'
    },
    {
      content: 'docchi.pl',
      type: ActivityType.Watching,
      url: 'https://docchi.pl'
    }
  ]

  setInterval(() => {
    let random = Math.floor(Math.random() * statusArray.length)
    client.user.setPresence({
      activities: [
        {
          name: statusArray[random].content,
          type: statusArray[random].type,
          url: statusArray[random].url
        }
      ],
      status: 'idle'
    })
  }, 1000 * 60);
})

client.on("messageCreate", async (msg) => {
  if (!msg.content.startsWith('!')) return;

  const args = msg.content.slice(1).split(" ");
  const command = args.shift().toLowerCase();
  const argumentClean = args[0]
    ? args[0].replaceAll("@", "").toLowerCase()
    : null;

  switch (command) {
    case 'dice':
    case 'kosci': {

      if (cooldown > Date.now() - 2000) {
        break;
      }
      cooldown = Date.now();

      const command = await Dice(msg, argumentClean);

      if (["info"].includes(argumentClean)) {
        const embed = new EmbedBuilder()
          .setColor(8086271)
          .setAuthor({ name: `Komenda - Dice`, iconURL: `https://ttvu.link/logo512.png` })
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

      if (command === null) {
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'punkty':
    case 'points': {
      if (cooldown > Date.now() - 2000) {
        break;
      }
      cooldown = Date.now();

      const command = await Points(msg, argumentClean, args);

      if (["info"].includes(argumentClean)) {
        const embed = new EmbedBuilder()
          .setColor(8086271)
          .setAuthor({ name: `Komenda - Points`, iconURL: `https://ttvu.link/logo512.png` })
          .setDescription('**Opis:** Pokazuje liczbe punktów oraz możesz robić transfer punktów')
          .setThumbnail(`https://ttvu.link/logo512.png`)
          .addFields(
            { name: `❯ Użycie komendy:`, value: `!points\n!points 3xanax\n!points ranking\n!points send 3xanax 100` },
            { name: `❯ rgumenty:`, value: `user, ranking, send, kwota` },
            { name: `❯ Aliasy:`, value: `!punkty` },
          )
          .setImage(`https://ttvu.link/og-default.png`)
          .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
          .setTimestamp();

        return msg.channel.send({ embeds: [embed] });
      }

      if (command === null) {
        break;
      }
      msg.channel.send(command);

      break;
    }
    case 'ekwipunek':
    case 'eq':
    case 'inventory':
    case 'inv': {
      if (cooldown > Date.now() - 2000) {
        break;
      }
      cooldown = Date.now();

      const command = await Inventory(msg, argumentClean, args);

      if (["info"].includes(argumentClean)) {
        const embed = new EmbedBuilder()
          .setColor(8086271)
          .setAuthor({ name: `Komenda - Case`, iconURL: `https://ttvu.link/logo512.png` })
          .setDescription('**Opis:** Pokazuje co udało Ci się zdobyć')
          .setThumbnail(`https://ttvu.link/logo512.png`)
          .addFields(
            { name: `❯ Użycie komendy:`, value: `!eq\n!eq sell 34` },
            { name: `❯ Argumenty:`, value: `sell` },
            { name: `❯ Aliasy:`, value: `!ekwipunek, !inventory, !inv` },
          )
          .setImage(`https://ttvu.link/og-default.png`)
          .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
          .setTimestamp();

        return msg.channel.send({ embeds: [embed] });
      }

      if (command === null) {
        break;
      }
      msg.channel.send(command);

      break;
    }
    case 'slot':
    case 'slotsy':
    case 'slots': {
      if (cooldownSpecial > Date.now() - 2000) {
        break;
      }
      cooldownSpecial = Date.now();

      const command = await Slots(msg, argumentClean);

      if (["info"].includes(argumentClean)) {
        const embed = new EmbedBuilder()
          .setColor(8086271)
          .setAuthor({ name: `Komenda - Slots`, iconURL: `https://ttvu.link/logo512.png` })
          .setDescription('**Opis:** Proste slotsy na 3 rolki')
          .setThumbnail(`https://ttvu.link/logo512.png`)
          .addFields(
            { name: `❯ Użycie komendy:`, value: `!slots 100` },
            { name: `❯ Argumenty:`, value: `kwota` },
            { name: `❯ Aliasy:`, value: `!slot, !sloty` },
          )
          .setImage(`https://ttvu.link/og-default.png`)
          .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
          .setTimestamp();

        return msg.channel.send({ embeds: [embed] });
      }

      if (command === null) {
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'ruletka':
    case 'roulette': {
      if (cooldown > Date.now() - 2000) {
        break;
      }
      cooldown = Date.now();

      const command = await Roulette(msg, argumentClean, args);

      if (["info"].includes(argumentClean)) {
        const embed = new EmbedBuilder()
          .setColor(8086271)
          .setAuthor({ name: `Komenda - Roulette`, iconURL: `https://ttvu.link/logo512.png` })
          .setDescription('**Opis:** Postaw na kolor który wyleci')
          .setThumbnail(`https://ttvu.link/logo512.png`)
          .addFields(
            { name: `❯ Użycie komendy:`, value: `!roulette red 100` },
            { name: `❯ Argumenty:`, value: `Kolory: red [x2], black [x2], blue [x3], orange [x5], green [x14]\nInne: kwota` },
            { name: `❯ Aliasy:`, value: `!ruletka` },
          )
          .setImage(`https://ttvu.link/og-default.png`)
          .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
          .setTimestamp();

        return msg.channel.send({ embeds: [embed] });
      }

      if (command === null) {
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'skrzynka':
    case 'case':
    case 'skrzynia':
    case 'crate': {

      if (cooldown > Date.now() - 2000) {
        break;
      }
      cooldown = Date.now();

      const command = await Case(msg, argumentClean, args);

      if (["info"].includes(argumentClean)) {
        const embed = new EmbedBuilder()
          .setColor(8086271)
          .setAuthor({ name: `Komenda - Case`, iconURL: `https://ttvu.link/logo512.png` })
          .setDescription('**Opis:** Otwieranie skrzynek')
          .setThumbnail(`https://ttvu.link/logo512.png`)
          .addFields(
            { name: `❯ Użycie komendy:`, value: `!case snake\n!case chance snake\n!case lista snake` },
            { name: `❯ Argumenty:`, value: `**Skrzynki:** snake, nightmare, riptide, cobble, huntsman\n**Inne:** chance, szansa, lista, list` },
            { name: `❯ Aliasy:`, value: `!skrzynka, !skrzynia, !crate` },
          )
          .setImage(`https://ttvu.link/og-default.png`)
          .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
          .setTimestamp();

        return msg.channel.send({ embeds: [embed] });
      }

      if (command === null) {
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'zglos': {

      const command = await Zglos(msg, args);

      if (command === null) {
        break;
      }

      if (command.type === "text") {
        msg.channel.send(command.data);

        break;
      }

      client.channels.cache
        .get("1083775118209187910")
        .send({ embeds: [command.data] })
        .catch(console.error);

      break;
    }
    case 'roles':
    case 'buy': {
      const command = await Buy(msg, argumentClean);

      if (command === null) {
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'pomoc':
    case 'help': {
      const embed = new EmbedBuilder()
        .setColor(8086271)
        .setAuthor({ name: `POMOC | Lista Komend`, iconURL: `https://ttvu.link/logo512.png` })
        .setDescription(`[Strona Internetowa](http://ttvu.link)\n[GitHub](https://github.com/YFLUpdates/ttvupdates-discord)`)
        .setThumbnail(`https://ttvu.link/logo512.png`)
        .addFields(
          { name: `❯ !case [chance/lista]`, value: `Otwieranie skrzynek` },
          { name: `❯ !dice {kwota}`, value: `Rzuć kostkami o punkty` },
          { name: `❯ !eq [sell] {id}`, value: `Pokazuje co udało Ci się zdobyć` },
          { name: `❯ !roulette [red/black/green/blue/orange] {kwota}`, value: `Postaw na kolor który wyleci` },
          { name: `❯ !slots {kwota}`, value: `Proste slotsy na 3 rolki` },
          { name: `❯ !points [user/ranking/send] {user} {kwota}`, value: `Pokazuje liczbe punktów oraz możesz robić transfer punktów` },
          { name: `❯ !cmd [info]`, value: `Pokazuje informacje o komendzie` },
        )
        .setImage(`https://ttvu.link/og-default.png`)
        .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
        .setTimestamp();


      msg.channel.send({ embeds: [embed] });

      break;
    }
    default:
      break;
  }
});

client.login(process.env.TOKEN);