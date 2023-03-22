// let strefy = JSON.parse(await fs.readFile("./strefy.json", "UTF-8"));
// const channel = "1071137965859930205";
// let strefy = JSON.parse(await fs.readFile("./strefy.json", "UTF-8"));
// async function saveStrefa(userID, username) {
//     const inArray = strefy.findIndex((object) => {
//       return object.custom_id === userID;
//     });
  
//     if (inArray !== -1) {
//       strefy[inArray].value = `${Number(strefy[inArray].value) + 1}`;
//     } else {
//       strefy.push({
//         name: username,
//         custom_id: userID,
//         value: "1",
//         inline: true,
//       });
//     }
  
//     fs.writeFile("strefy.json", JSON.stringify(strefy), (err) => {
//       console.log(err);
//     });
//   }

// if (msg.channelId === channel && Array.from(msg.attachments).length > 0
//   ) {
//     await saveStrefa(msg.author.id, msg.author.username);

//     const embed = new EmbedBuilder()
//       .setTitle("Przejęte strefy")
//       .setImage(
//         "https://cdn.discordapp.com/attachments/721911008213598238/1071145394655985674/Newsy_2.0.png"
//       )
//       .setColor(8086271)
//       .addFields(strefy);

//     client.channels.cache
//       .get(channel)
//       .send({ embeds: [embed] })
//       .catch(console.error);
//   }