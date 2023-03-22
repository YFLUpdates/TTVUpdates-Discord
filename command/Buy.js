import { aha, fire, mhm, okurwa } from "../functions/slots/data/discordEmotes.js";
import gambleUpdate from "../requests/gambleUpdate.js";
import getPoints from "../requests/getPoints.js";

export default async function commandBuy(msg, argumentClean){
    const gambleChannel = "1083102450472468480";

    if (msg.channelId !== gambleChannel) {
        return null;
    }
  
      const discordID = msg.author.id;
  
      if (!argumentClean || argumentClean !== "hazardzista") {
        return `<@${discordID}>, dostępne produkty: hazardzista - 1mln`;
      }
  
      const points = await getPoints(discordID, "adrian1g__");
  
      if (points === null || points.points === null) {
        return `<@${discordID}> najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc "+discordID+"`"} na kanale adrian1g__`;
      }
  
      if (1000000 > points.points) {
        return `<@${discordID}> nie masz wystarczającej liczby punktów ${aha}`;
      }
  
      if(msg.member.roles.cache.some(r => r.name === "hazardzista")){
        return `<@${discordID}> posiadasz już te rangę! ${mhm}`;
      }
  
      const updatePoints = await gambleUpdate("adrian1g__", `-1000000`, points.user_login);
  
      if (updatePoints === null) {
        return `<@${discordID}> coś się rozjebało przy aktualizowaniu punktów ${aha}`;
      }
  
      let role = msg.guild.roles.cache.find(r => r.name === "hazardzista");
      msg.member.roles.add(role).catch(console.error);
  
      return `Gratulacje <@${discordID}>! zakupiłeś range Hazardzista ${okurwa} ${fire}`;
}