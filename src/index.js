import { Client, EmbedBuilder, GatewayIntentBits, ActivityType } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import { Dice, Buy, Slots, Zglos, Points, Roulette, Case, Inventory, Duel, Fish, Daily} from "./commands/index.js";

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

const duels_list = [];

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
      content: 'https:/\/ttvu.link',
      type: ActivityType.Playing
    },
    {
      content: 'https:/\/buycoffee.to/docchi',
      type: ActivityType.Competing
    },
    {
      content: 'https:/\/docchi.pl',
      type: ActivityType.Watching
    },
    {
      content: '!pomoc dla listy komend',
      type: ActivityType.Custom
    }
  ]

  setInterval(() => {
    let random = Math.floor(Math.random() * statusArray.length)
    client.user.setPresence({
      activities: [
        {
          name: statusArray[random].content,
          type: statusArray[random].type
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

      if (command === null) {
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'duel':
    case 'pojedynek': {
      if (cooldown > Date.now() - 2000) {
        break;
      }
      cooldown = Date.now();

      const command = await Duel(msg, argumentClean, args, duels_list);

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
    // case 'daily': {
    //   const command = await Daily(msg, argumentClean)

    //   if (command === null) {
    //     break;
    //   }

    //   msg.channel.send(command);

    //   break;
    // }
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
          { name: `❯ !eq [sell] {id}`, value: `Pokazuje co udało Ci się zdobyć oraz pozwala sprzedać itemy.` },
          { name: `❯ !roulette [red/black/green/blue/orange] {kwota}`, value: `Postaw na kolor który wyleci` },
          { name: `❯ !slots {kwota}`, value: `Proste slotsy na 3 rolki` },
          { name: `❯ !points [user/ranking/send] {user} {kwota}`, value: `Pokazuje liczbe punktów oraz pozwala zrobić transfer punktów` },
          { name: `❯ !cmd [info]`, value: `Pokazuje informacje o komendzie` },
        )
        .setImage(`https://ttvu.link/og-default.png`)
        .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
        .setTimestamp();


      msg.channel.send({ embeds: [embed] });

      break;
    }
    case 'fishing':
    case 'fish':
    case 'lowienie': {

      if (cooldown > Date.now() - 3000) {
        break;
      }
      cooldown = Date.now();

      const command = await Fish(msg, argumentClean, args);

      if (command === null) {
        break;
      }

      msg.channel.send(command);

      break;
    }
    default:
      break;
  }
});

client.login(process.env.TOKEN);
