import getPoints from "../requests/getPoints.js";
import duelUpdate from "../requests/duelUpdate.js";
import getRanking from "../requests/getRanking.js";
import { aha, aok, hm, jasperTragedia } from "../functions/slots/data/discordEmotes.js";
import { EmbedBuilder } from "discord.js";

export default async function commandPoints(msg, argumentClean, args) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }
  
  const discordID = msg.author.id;

  if (argumentClean === "ranking") {
    const topka = await getRanking();
    let temp = [];

    if(topka === null){
      return `Nie udało się pobrać rankingu ${jasperTragedia}`;
    }

    await Promise.all(
      topka.map(async function(x, index) {
        temp.push({
            name: `#${index+1} - ${"``"+x.user_login+"``"}`,
            value: `${hm} ${new Intl.NumberFormat('pl-PL').format(x.points)}`
        });
      })
    )
    

    const embed = new EmbedBuilder()
    .setTitle("Ranking adrian1g__")
    .setDescription("Top 10 najbardziej zaklinowanych osób")
    .setColor(8086271)
    .setThumbnail('https://i.imgur.com/Br5FkbV.png')
    .addFields(temp)
    .setFooter({ text: 'yfl.es/streamer/adrian1g__' })
    .setTimestamp();

    
    msg.channel.send({ embeds: [embed] });

    return null;

    return `Najwięcej punktów mają: ${topka} - https://yfl.es/streamer/adrian1g__`;
  }
  
  if (argumentClean === "send") {

    if (!args[1] || args[1] == " "){
       return `<@${discordID}>, zapomniałeś/aś podać osobe `; 
    }

    if (!args[2] || Number(args[2]) <= 0 || isNaN(args[2])){
       return `<@${discordID}>, zapomniałeś/aś o kwocie `; 
    }
      
    const receiver = args[1].toLowerCase();
    const betPoints = Number(args[2]);
    const points = await getPoints(discordID, "adrian1g__");

    if (points === null || points.points === null) {
      return `<@${discordID}> najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc "+discordID+"`"} na kanale adrian1g__`;
    }

    if (betPoints > points.points) {
        return `<@${discordID}>, nie masz tylu punktów ${aha}`;
    }

    const req = await duelUpdate("adrian1g__", {
      points: betPoints,
      winner: receiver,
      loser: points.user_login,
    });

    if (req === null){
      return `<@${discordID}>, ${receiver} jeszcze nie został/a zarejestrowany/a, nie jesteś w stanie wysłać mu/jej punktów ${aok}`;
    }
    
    return `<@${discordID}>, wysłałeś/aś ${new Intl.NumberFormat('pl-PL').format(betPoints)} punktów do ${receiver}`;
  }
  
  if (argumentClean && argumentClean.length > 3) {
    const points = await getPoints(argument, "adrian1g__", true);

    if(points === null || points.points === null){
      return `<@${discordID}>, nie udało się pobrać danych ${aha}`;
    }

    return `${argumentClean}, posiada ${new Intl.NumberFormat('pl-PL').format(points.points)} punktów ${aok}`;
  }

    const points = await getPoints(discordID, "adrian1g__");

    if(points === null || points.points === null){
      return `<@${discordID}> najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc "+discordID+"`"} na kanale adrian1g__`;
    }

    return `<@${discordID}>, posiadasz ${new Intl.NumberFormat('pl-PL').format(points.points)} punktów ${aok}`;
}
