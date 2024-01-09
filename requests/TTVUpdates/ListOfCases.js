import axios from "axios";

export default async function ListOfCases() {
    let url = `https://public.ttvu.link/bot_games/listOfCases.json`;

    return await axios.get(url, { headers: { 'Content-type': 'application/json' } })
        .then(async (data) => {
            const res = data.data;

            return res;
        })
        .catch(err => {
            // console.log(err)
            return null;
        })
}