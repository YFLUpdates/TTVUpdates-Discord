import axios from "axios";

export default async function getRanking() {
    return await axios.get(
        `${process.env.APP_SERVER_URL}/v1/user/channel/ranking/points/adrian1g__`,
        { headers: { "Content-type": "application/json" } }
      )
      .then(async (res) => {
        return res.data;
      })
      .catch((err) => {
        return null;
        // console.log(err);
      });
}