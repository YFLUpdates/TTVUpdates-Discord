// import { Client, GatewayIntentBits } from "discord.js";
// import express from "express";
// import dotenv from "dotenv";

// dotenv.config();

// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//   ],
// });
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.set("json spaces", 2);
// app.use(express.json());

// app.use((req, res, next) => {
//   res.status(404).json({
//     message: `Route ${req.method}:${req.url} not found`,
//     error: "Not Found",
//     statusCode: 404,
//   });
// });

// app.listen(PORT, () => console.log(`API Server listening on port ${PORT}`));

// client.on("ready", () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// client.on("messageCreate", async (msg) => {
//     const args = msg.content.split(" ");

//         if(msg.author.id === "705529875389218846" && args[0] === "!vip"){
//             const mentioned = msg.mentions.members.first();

//             let role = msg.guild.roles.cache.find(r => r.name === "VIP");
    
//             mentioned.roles.add(role).catch(console.error)

//             msg.channel.send('» Nadano range `VIP` dla '+args[1])
//         }
// });

// client.login(process.env.TOKEN);
