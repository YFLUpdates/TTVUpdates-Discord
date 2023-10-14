import axios from "axios";

export default async function DeleteItem(user, item) {
  return await axios({
    url: `${process.env.APP_SERVER_URL}/v1/inventory/admin/item/delete`,
      method: "DELETE",
      body: JSON.stringify({
        user_login: user,
        id: item,
      }),
      headers: {
        "Content-type": "application/json",
        "client-id": process.env.DEV_TOKEN_CLIENTID || process.env.TOKEN_CLIENTID,
        authorization: process.env.DEV_TOKEN_AUTHORIZATION || process.env.TOKEN_AUTHORIZATION,
      },
  })
  .then(async (res) => {
    return res.data;
  })
  .catch((err) => {
          // console.log(err);
    return null;
  });
}