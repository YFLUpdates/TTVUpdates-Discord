import axios from "axios";

export default async function WipeInventory(user, items) {
    return await axios({
        url: `${process.env.APP_SERVER_URL}/v1/inventory/admin/inventory/delete`,
        method: "DELETE",
        data: {
            user_login: user,
            items: items,
        },
        headers: {
            'Content-type': 'application/json',
            "client-id": process.env.DEV_TOKEN_CLIENTID || process.env.TOKEN_CLIENTID,
            authorization: process.env.DEV_TOKEN_AUTHORIZATION || process.env.TOKEN_AUTHORIZATION,
        }
    })
        .then(async (res) => {
            return res.data;
        })
        .catch(err => {
            return null;
        })
}