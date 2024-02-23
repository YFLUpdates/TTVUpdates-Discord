import axios from "axios";

export default async function duelUpdate(channel, json) {
    return await axios({
        url: `${process.env.APP_SERVER_URL}/v1/user/channels/duel/${channel}`,
        method: "put",
        data: json,
        headers: {
            'Content-type': 'application/json',
            "client-id": process.env.DEV_TOKEN_CLIENTID || process.env.TOKEN_CLIENTID,
            authorization: process.env.DEV_TOKEN_AUTHORIZATION || process.env.TOKEN_AUTHORIZATION,
        }
    })
        .then(async (res) => {
            //console.log(data)
            return res.data;
        })
        .catch(err => {
            //console.log(err)

            return null;
        })
}