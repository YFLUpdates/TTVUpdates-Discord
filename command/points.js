import getPoints from "../requests/getPoints.js";
import duelUpdate from "../requests/duelUpdate.js";
import axios from "axios";

async function getTop() {
  return await axios
    .get(
      `https://api.yfl.es/v1/rankings/channel/ranking/points/adrian1g__`,
      { headers: { "Content-type": "application/json" } }
    )
    .then(async (res) => {
      return res.data
        .slice(0, 3)
        .map((i) => {
          return `${i.user_login}(${i.points})`;
        })
        .join(", ");
    })
    .catch((err) => {
      console.log(err);
    });
}

export default async function points(channel, discordID, argument, args) {

  if (argument === "ranking") {
    const topka = await getTop();

    return `Najwięcej punktów mają: ${topka} - https://yfl.es/streamer/${channel}`;
  } else if (argument === "send") {
    if (!args[1] || args[1] == " "){
       return `<@${discordID}>, zapomniałeś/aś podać osobe `; 
    }

    if (!args[2] || Number(args[2]) <= 0 || isNaN(args[2])){
       return `<@${discordID}>, zapomniałeś/aś o kwocie `; 
    }
      
    const receiver = args[1].toLowerCase();
    const betPoints = Number(args[2]);
    const points = await getPoints(discordID, "adrian1g__");

    if(points === null || points.points === null){
      return "<@"+ discordID +"> najprawdopodobniej nie połączyłeś/aś bota ze swoim kontem `!connectdc "+discordID+"` na kanale adrian1g__";
    }

    if (betPoints > points.points) {
        return `<@${discordID}>, nie masz tylu punktów`;
    }

    const req = await duelUpdate(channel, {
      points: betPoints,
      winner: receiver,
      loser: points.user_login,
    });

    if (req === null)
      return `<@${discordID}>, ${receiver} jeszcze nie został/a zarejestrowany/a, nie jesteś w stanie wysłać mu/jej punktów`;

    return `<@${discordID}>, wysłałeś/aś ${betPoints} punktów do ${receiver}`;
  } else if (argument && argument.length > 3) {
    const points = await getPoints(argument, "adrian1g__", true);

    if(points === null || points.points === null){
      return "<@"+ discordID +"> nie udało się pobrać danych";
    }

    return `${argument}, ma ${points.points} punktów`;
  } else {
    const points = await getPoints(discordID, "adrian1g__");

    if(points === null || points.points === null){
      return "<@"+ discordID +"> najprawdopodobniej nie połączyłeś/aś bota ze swoim kontem `!connectdc "+discordID+"` na kanale adrian1g__";
    }

    return `<@${discordID}>, masz ${points.points} punktów`;
  }
}
