import axios from "axios";

export default async function gambleUpdate(channel, points, who){
    return await axios({
        url: `https://api.yfl.es/v1/user/gamble/${channel}`,
        method: "put",
        data: {
            points: points,
            who: who
        },
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