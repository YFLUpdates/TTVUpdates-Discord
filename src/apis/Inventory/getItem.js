import axios from "axios";

export default async function GetItem(user, item) {
  return await axios({
    url: `${process.env.APP_SERVER_URL}/v1/inventory/item/${user}?item_id=${item}`,
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