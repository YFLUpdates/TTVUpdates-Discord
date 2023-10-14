import axios from "axios";

export default async function GetInventory(user, channel) {
  return await axios({
    url: `${process.env.APP_SERVER_URL}/v1/inventory/full/${user}?channel=${channel}`,
      method: "get",
      headers: {
        "Content-type": "application/json",
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