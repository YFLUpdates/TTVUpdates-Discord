import axios from "axios";

export default async function getUserTwitch(user, channelName, ttv) {
    let url = `${process.env.APP_SERVER_URL}/v1/user/twitch/${user}?channel=${channelName}`;

    if (ttv) {
        url = `${process.env.APP_SERVER_URL}/v1/user/twitch/${user}?channel=${channelName}`;
    }

    return await axios.get(url, { headers: { 'Content-type': 'application/json' } })
        .then(async (data) => {
            const res = data.data;

            return { points: res.points === null ? null : res.points, user_login: res.user_login ? res.user_login : null };
        })
        .catch(err => {
            // console.log(err)
            return null;
        })
}