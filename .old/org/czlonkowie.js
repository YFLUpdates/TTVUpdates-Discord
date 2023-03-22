// async function getMembers() {
//     let temp = [];
  
//     await Promise.all(
//       members.map(async function (x) {
//         temp.push(
//           {
//             name: x.role,
//             value: `<@${x.discord}>`,
//             inline: true,
//           },
//           {
//             name: "In Game",
//             value: x.ingame,
//             inline: true,
//           },
//           {
//             name: "\u200B",
//             value: "\u200B",
//             inline: true,
//           }
//         );
//       })
//     );
  
//     return temp;
//   }

// if (msg.channelId === "1069641216637014139" && ["czlonkowie"].includes(command)) {
//     const embed = new EmbedBuilder()
//       .setTitle("Członkowie")
//       .setImage(
//         "https://cdn.discordapp.com/attachments/721911008213598238/1071105446401822720/test.png"
//       )
//       .setColor(8086271)
//       .addFields(await getMembers());

//     const messages = await client.channels.cache
//       .get("1070971336777793606")
//       .messages.fetch();

//     // get the newest message by the user
//     const d = messages.filter((msg) => msg.embeds.length > 0).first();

//     d.edit({ embeds: [embed] });
//   }