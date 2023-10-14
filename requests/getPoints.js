import axios from "axios";

export default async function getPoints(user, channelName, ttv) {
    let url = `https://api.ttvu.link/v1/user/discord/${user}?channel=${channelName}`;
    
    if(ttv){
        url = `https://api.ttvu.link/v1/user/discord/${user}?channel=${channelName}`;
    }

    return await axios.get(url, {headers: {'Content-type': 'application/json'}})
    .then(async (data) => {
        const res = data.data;

        return {points: res.points === null ? null : res.points, user_login: res.user_login ? res.user_login : null};
    })
    .catch(err => {
        // console.log(err)
        return null;
    })
}