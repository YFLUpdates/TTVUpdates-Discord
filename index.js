import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import {Dice, Buy, Slots, Zglos, Points, Roulette} from "./command/index.js";

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

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if(!msg.content.startsWith('!')) return;

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

      if(command === null){
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

      const command = await Points(msg.channelId, "adrian1g__", msg.author.id, argumentClean, args);

      if(command === null){
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

      if(command === null){
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

      if(command === null){
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'zglos': {

      const command = await Zglos(msg, args);

      if(command === null){
        break;
      }

      if(command.type === "text"){
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

      if(command === null){
        break;
      }

      msg.channel.send(command);

      break;
    }
    case 'pomoc':
    case 'help': {
      const embed = new EmbedBuilder()
      .setTitle("Pomoc")
      .setColor(8086271)
      .setDescription("***»*** ``!dice {kwota/info} - Rzuć kośćmi o punkty.``\n***»*** ``!slots {kwota/info}``\n***»*** ``!ruletka {kolor/info} {kwota} - Postaw na kolor i zobacz czy wygrasz``\n***»*** ``!buy {hazardzista} - Kup specjalne role.``\n***»*** ``!punkty {puste/nick ttv} - Sprawdz punkty.``")
      .setTimestamp();

      
      msg.channel.send({ embeds: [embed] });
      
      break;
    }
    default:
      break;
  }
});

client.login(process.env.TOKEN);
