import axios from "axios";

export default async function getRanking() {
    return await axios.get(
        `https://api.yfl.es/v1/rankings/channel/ranking/points/adrian1g__`,
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