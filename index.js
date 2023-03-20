import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import { promises as fs } from "fs";
import middleware from "./authz/docchi-server.js";
import pointsCom from "./command/points.js";
import multiplyDice from "./functions/multiplyDice.js";
import rollDice from "./functions/rollDice.js";
import { slotsInfo } from "./functions/slots/data/slotsData.js";
import { runSlots } from "./functions/slots/slots.js";
import gambleUpdate from "./requests/gambleUpdate.js";

import getPoints from "./requests/getPoints.js";

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
const channel = "1071137965859930205";
const gambleChannel = "1083102450472468480";
let cooldown = 0;
let strefy = JSON.parse(await fs.readFile("./strefy.json", "UTF-8"));
let members = JSON.parse(await fs.readFile("./members.json", "UTF-8"));

app.set("json spaces", 2);
app.use(express.json());

app.post("/events/members", middleware, async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!",
      status: 400,
    });
  }

  res.status(200).send({
    message: "Success",
    status: 200,
  });

  eventsMembers(req.body);
});

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

async function saveStrefa(userID, username) {
  const inArray = strefy.findIndex((object) => {
    return object.custom_id === userID;
  });

  if (inArray !== -1) {
    strefy[inArray].value = `${Number(strefy[inArray].value) + 1}`;
  } else {
    strefy.push({
      name: username,
      custom_id: userID,
      value: "1",
      inline: true,
    });
  }

  fs.writeFile("strefy.json", JSON.stringify(strefy), (err) => {
    console.log(err);
  });
}

async function getMembers() {
  let temp = [];

  await Promise.all(
    members.map(async function (x) {
      temp.push(
        {
          name: x.role,
          value: `<@${x.discord}>`,
          inline: true,
        },
        {
          name: "In Game",
          value: x.ingame,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        }
      );
    })
  );

  return temp;
}

client.on("messageCreate", async (msg) => {
  const args = msg.content.slice(1).split(" ");
  const command = args.shift().toLowerCase();
  const argumentClean = args[0]
    ? args[0].replaceAll("@", "").toLowerCase()
    : null;

  if (["dice", "kosci"].includes(command)) {
    if (msg.channelId !== gambleChannel) {
      return;
    }

    if (cooldown > Date.now() - 2000) {
      return;
    }
    cooldown = Date.now();

    const discordID = msg.author.id;
    const points = await getPoints(discordID, "adrian1g__");

    if (!argumentClean) {
      return msg.channel.send(`<@${discordID}>, zapomniałeś/aś o kwocie `);
    }

    if (
      Number(argumentClean) > 5000 ||
      Number(argumentClean) <= 0 ||
      isNaN(argumentClean)
    ) {
      return msg.channel.send(
        `<@${discordID}>, maksymalnie można obstawić 5000 punktów `
      );
    }

    if (points === null || points.points === null) {
      return msg.channel.send(
        "<@" +
        discordID +
        "> najprawdopodobniej nie połączyłeś bota ze swoim kontem `!connectdc " +
        discordID +
        "` na kanale adrian1g__"
      );
    }

    if (Number(argumentClean) > points.points) {
      return msg.channel.send(`<@${discordID}> nie masz tylu punktów aha `);
    }

    const dice1 = await rollDice();
    const dice2 = await rollDice();
    const dice3 = await rollDice();
    const betPoints = Number(argumentClean);
    const multiplyAmount = multiplyDice(dice1, dice2, dice3);

    if (multiplyAmount === null) {
      const updatePoints = await gambleUpdate(
        "adrian1g__",
        `-${betPoints}`,
        points.user_login
      );

      if (updatePoints === null) {
        return msg.channel.send(
          `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów <:aha:1014651386505465896> `
        );
      }

      return msg.channel.send(
        `<@${discordID}> przegrałeś/aś wszystko <:jasperSmiech:1026122842976309402> - 🎲${dice1} 🎲${dice2} 🎲${dice3}`
      );
    }

    const winAmount = betPoints * multiplyAmount;
    const updatePoints = await gambleUpdate(
      "adrian1g__",
      `+${winAmount - betPoints}`,
      points.user_login
    );

    if (updatePoints === null) {
      return msg.channel.send(
        `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów <:aha:1014651386505465896> `
      );
    }

    if (multiplyAmount === 66) {
      return msg.channel.send(
        `<@${discordID}> szatańska wygrana ${winAmount} <:okurwa:1016741160779268166> FIRE x66 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `
      );
    }

    if (multiplyAmount === 33) {
      return msg.channel.send(
        `<@${discordID}> szczęśliwa trójka ${winAmount} PartyKirby 🍀 🍀 x33 - 🎲${dice1} 🎲${dice2} 🎲${dice3} `
      );
    }

    return msg.channel.send(
      `<@${discordID}> wygrałeś/aś ${winAmount} punktów <:okurwa:1016741160779268166> - 🎲${dice1} 🎲${dice2} 🎲${dice3}`
    );
  } else if (["slot", "slots", "slotsy"].includes(command)) {
    const discordID = msg.author.id;

    if (msg.channelId !== gambleChannel) {
      return;
    }

    if (cooldown > Date.now() - 2000) {
      return;
    }
    cooldown = Date.now();

    if (argumentClean === "info") {
      return msg.channel.send(`<@${discordID}>, ${slotsInfo}`);
    }

    const points = await getPoints(discordID, "adrian1g__");

    if (!argumentClean) {
      return msg.channel.send(`<@${discordID}>, zapomniałeś/aś o kwocie `);
    }

    const betPoints = Number(argumentClean);
    if (betPoints > 20000 || betPoints <= 0 || !betPoints) {
      return msg.channel.send(
        `<@${discordID}>, maksymalnie można obstawić 20000 punktów `
      );
    }
    if (points === null || points.points === null) {
      return msg.channel.send(
        "<@" +
        discordID +
        "> najprawdopodobniej nie połączyłeś bota ze swoim kontem `!connectdc " +
        discordID +
        "` na kanale adrian1g__"
      );
    }
    if (betPoints > points.points) {
      return msg.channel.send(`<@${discordID}> nie masz tylu punktów aha `);
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
      return msg.channel.send(
        `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów <:aha:1014651386505465896> `
      );
    }

    return msg.channel.send(`<@${discordID}>, ${outcome.message}`);
  } else if (["yflpoints", "punkty", "points"].includes(command)) {
    const commands = await pointsCom(
      "adrian1g__",
      msg.author.id,
      argumentClean,
      args
    );
    msg.channel.send(commands);
  } else if (
    msg.channelId === channel &&
    Array.from(msg.attachments).length > 0
  ) {
    await saveStrefa(msg.author.id, msg.author.username);

    const embed = new EmbedBuilder()
      .setTitle("Przejęte strefy")
      .setImage(
        "https://cdn.discordapp.com/attachments/721911008213598238/1071145394655985674/Newsy_2.0.png"
      )
      .setColor(8086271)
      .addFields(strefy);

    client.channels.cache
      .get(channel)
      .send({ embeds: [embed] })
      .catch(console.error);
  } else if (
    msg.channelId === "1069641216637014139" &&
    ["czlonkowie"].includes(command)
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Członkowie")
      .setImage(
        "https://cdn.discordapp.com/attachments/721911008213598238/1071105446401822720/test.png"
      )
      .setColor(8086271)
      .addFields(await getMembers());

    const messages = await client.channels.cache
      .get("1070971336777793606")
      .messages.fetch();

    // get the newest message by the user
    const d = messages.filter((msg) => msg.embeds.length > 0).first();

    d.edit({ embeds: [embed] });
  } else if (["zglos"].includes(command)) {
    const senderID = msg.author.id;

    if (!args[0] || Number(args[0]) <= 0 || isNaN(args[0])) {
      return msg.channel.send(`<@${senderID}>, zapomniałeś/aś o kordach X `);
    }

    if (!args[1] || Number(args[1]) <= 0 || isNaN(args[1])) {
      return msg.channel.send(`<@${senderID}>, zapomniałeś/aś o kordach Y `);
    }

    if (!args[2] || Number(args[2]) <= 0 || isNaN(args[2])) {
      return msg.channel.send(`<@${senderID}>, zapomniałeś/aś o kordach Z `);
    }

    const embed = new EmbedBuilder()
      .setTitle("Nowe zgloszenie cuboida")
      .setImage(
        "https://cdn.discordapp.com/attachments/721911008213598238/1083879111388303360/Newsy_2.0.png"
      )
      .setColor(8086271)
      .setThumbnail("https://i.imgur.com/qzzZEVX.png")
      .addFields(
        { name: "Kordy cuboida", value: `${args[0]}, ${args[1]}, ${args[2]}` },
        { name: "Komenda", value: `/tp ${args[0]} ${args[1]} ${args[2]}` },
        { name: "Zgłaszający", value: `<@${senderID}>` }
      );

    client.channels.cache
      .get("1083775118209187910")
      .send({ embeds: [embed] })
      .catch(console.error);
  }
});

client.login(process.env.TOKEN);

function eventsMembers(data) {
  if (!data || !data.discord || !data.ingame || !data.role) {
    return console.log({ message: "Empty body" });
  }
  const inArray = members.findIndex((object) => {
    return object.discord === data.discord;
  });

  if (data.status === "true") {
    members.splice(inArray, 1);

    fs.writeFile("members.json", JSON.stringify(members), (err) => {
      console.log(err);
    });
    return;
  }

  if (inArray !== -1) {
    members[inArray] = {
      discord: data.discord,
      role: data.role,
      ingame: data.ingame,
    };
  } else {
    members.push({
      discord: data.discord,
      role: data.role,
      ingame: data.ingame,
    });
  }

  fs.writeFile("members.json", JSON.stringify(members), (err) => {
    console.log(err);
  });
}
