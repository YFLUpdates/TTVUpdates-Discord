import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import express from "express";
import dotenv from "dotenv";
import { promises as fs } from "fs";

import middleware from "./authz/docchi-server.js";

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
  if (msg.channelId === channel && Array.from(msg.attachments).length > 0) {
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
    msg.content === "!czlonkowie"
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
