import axios from "axios";

export default async function request(channel, json){
    return await axios({
        url: `https://api.yfl.es/v1/user/duel/${channel}`,
        method: "put",
        data: json,
        headers: {
            'Content-type': 'application/json',
            'clientID': process.env.YFL_CLIENT_ID,
            'token': process.env.YFL_TOKEN
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