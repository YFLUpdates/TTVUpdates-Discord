import axios from "axios";

export default async function CreateItem(user, item, price, img, channel) {
  return await axios({
    url: `${process.env.APP_SERVER_URL}/v1/inventory/admin/item/create`,
    method: "post",
    data: {
      user_login: user,
      item: item,
      price: price,
      img: img,
      channel: channel,
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
    .catch((err) => {
            // console.log(err);
      return null;
    });
}
