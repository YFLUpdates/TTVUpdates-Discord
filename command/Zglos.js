import { EmbedBuilder } from "discord.js";

export default async function commandZglos(msg, args){
    const gambleChannel = "1081747003253461022";

    if (msg.channelId !== gambleChannel) {
      return null;
    }

    const senderID = msg.author.id;

    if (!args[0] || Number(args[0]) <= 0 || isNaN(args[0])) {
      return {type: "text", data: `<@${senderID}>, zapomniałeś/aś o kordach X `};
    }

    if (!args[1] || Number(args[1]) <= 0 || isNaN(args[1])) {
      return {type: "text", data: `<@${senderID}>, zapomniałeś/aś o kordach Y `};
    }

    if (!args[2] || Number(args[2]) <= 0 || isNaN(args[2])) {
      return {type: "text", data: `<@${senderID}>, zapomniałeś/aś o kordach Z `};
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

    return {type: "embed", data: embed};
    // client.channels.cache
    //   .get("1083775118209187910")
    //   .send({ embeds: [embed] })
    //   .catch(console.error);
}