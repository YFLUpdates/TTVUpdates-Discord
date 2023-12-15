import fetch from "node-fetch";

export default async function UpdatePass(user, channel, fishing_pass) {
    try {
        const res = await fetch(
            `${process.env.APP_SERVER_URL}/v1/fishing/update/pass/${user}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    channel: channel,
                    fishing_pass: fishing_pass,
                }),
                headers: {
                    "Content-type": "application/json",
                    "client-id": process.env.TOKEN_CLIENTID,
                    authorization: process.env.TOKEN_AUTHORIZATION,
                },
            }
        );

        if (res.ok) {
            const data = await res.json();

            return data;
        }
        return null;
    } catch (err) {
        return null;
    }
}
