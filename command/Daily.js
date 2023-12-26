// import gambleUpdate from '../requests/gambleUpdate.js'
// import getPoints from '../requests/getPoints.js'
// import drawingPoints from '../functions/daily/drawingDailyPoints.js'
// import humanizeDuration from 'humanize-duration'

export default async function commandDaily(msg, argumentClean) {
    return null;
    // const gambleChannel = process.env.GAMBLE_CHANNEL

    // if (msg.channelId !== gambleChannel) {
    //     return null
    // }

    // const discordID = msg.author.id;

    // if (!argumentClean) {
    //     return `<@${discordID}>, zapomniałeś podać argument: free, premium`
    // }

    // if (['info'].includes(argumentClean)) {
    //     const embed = new EmbedBuilder()
    //         .setColor(8086271)
    //         .setAuthor({ name: `Komenda - Daily`, iconURL: `https://ttvu.link/logo512.png` })
    //         .setDescription('**Opis:** Odbieraj codziennie dodatkowe punkty.')
    //         .setThumbnail(`https://ttvu.link/logo512.png`)
    //         .addFields(
    //             { name: `❯ Użycie komendy:`, value: `!daily free` },
    //             { name: `❯ Argumenty:`, value: `free, premium` },
    //             { name: `❯ Aliasy:`, value: `Brak` }
    //         )
    //         .setImage(`https://ttvu.link/og-default.png`)
    //         .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
    //         .setTimestamp()

    //     return { embeds: [embed] }
    // }

    // if (!['free', 'premium'].includes(argumentClean)) {
    //     return `<@${discordID}>, nie jesteśmy w stanie rozpoznać tego daily`
    // }

    // const userInfo = await getPoints(discordID, 'adrian1g__')

    // if (userInfo === null || userInfo.points === null) {
    //     return `<@${discordID}>, najprawdopodobniej nie połączyłeś konta. Zrób to za pomoca wpisania ${'`!connectdc ' + discordID + '`'
    //         } na kanale [adrian1g__](https://twitch.tv/adrian1g__)`
    // }

    // const {points, last_daily} = userInfo;
    // const currentDate = new Date();
    // const passDate = new Date(last_daily || "2011-12-13T14:57:34.000Z");

    // if(passDate > currentDate){
	// 	const timeDifference = passDate.getTime() - currentDate.getTime();

	// 	return `@${user}, Odebrać punkty możesz dopiero za: ${humanizeDuration(Math.round(timeDifference), { language: "pl", round: true })}`;
	// }

    // if (['premium'].includes(argumentClean)) {
    //     if (points < 1500) {
	// 		return `@${user}, nie masz tylu punktów, daily premium kosztuje 1500 punktów.`
	// 	}

	// 	const removePoints = await gambleUpdate("adrian1g__", `-1500`, userInfo.user_login)

	// 	if (removePoints === null) {
	// 		return `@${user}, błąd podczas aktualizowania punktów, skontaktuj się z administratorem.`
	// 	}
    // }

    // const drawedPoints = drawingPoints(argumentClean);

    // const updatePoints = await gambleUpdate('adrian1g__', `+${drawedPoints}`, user)

    // if (updatePoints === null) {
    //     return `<@${discordID}>, błąd podczas aktualizowania punktów, skontaktuj się z administratorem.`
    // }

    // const updateDailyDate = DailyUpdate(user, channelClean, CleanDatabaseDate(), TimeIn24Hours());

	// return `@${user}, udało Ci się wylosować ${drawedPoints} pkt! jasperGratulacje`;
}
