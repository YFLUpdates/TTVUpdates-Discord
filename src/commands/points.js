import { getPoints, duelUpdate, getRanking } from "@apis/TTVUpdates/index.js"

import { aha, aok, hm, jasperTragedia } from "@components/discordEmotes.js";
import { EmbedBuilder } from "discord.js";

export default async function commandPoints(msg, argumentClean, args) {
  const gambleChannel = process.env.GAMBLE_CHANNEL;

  if (msg.channelId !== gambleChannel) {
    return null;
  }
  
  const discordID = msg.author.id;

  if(argumentClean === "info") {
		const embed = new EmbedBuilder()
		  .setColor(8086271)
		  .setAuthor({ name: `Komenda - Points`, iconURL: `https://ttvu.link/logo512.png`})
		  .setDescription('**Opis:** Pokazuje liczbe punktów oraz możesz robić transfer punktów')
		  .setThumbnail(`https://ttvu.link/logo512.png`)
		  .addFields(
			{ name: `❯ Użycie komendy:`, value: `!points\n!points 3xanax\n!points ranking\n!points send 3xanax 100` },
			{ name: `❯ Argumenty:`, value: `user, ranking, send, kwota` },
			{ name: `❯ Aliasy:`, value: `!punkty` },
		  )
		  .setImage(`https://ttvu.link/og-default.png`)
		  .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
		  .setTimestamp();
	
		return { embeds: [embed] };
	}

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
    .setFooter({ text: 'ttvu.link/streamer/adrian1g__' })
    .setTimestamp();

    
    return { embeds: [embed] };
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
      return `<@${discordID}>, najprawdopodobniej nie połączyłeś konta. Zrób to za pomoca wpisania ${"`!connectdc "+discordID+"`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
    }

    if(receiver === points.user_login) {
      return `<@${discordID}>, nie możesz sobie samemu przesłać punktów.`
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
    const points = await getPoints(argumentClean, "adrian1g__", true);

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
