import gambleUpdate from '../requests/gambleUpdate.js'
import getPoints from '../requests/getPoints.js'
import drawingPoints from '../functions/daily/drawingDailyPoints.js'

export default async function commandDaily(msg, argumentClean) {
    const gambleChannel = process.env.GAMBLE_CHANNEL

    if (msg.channelId !== gambleChannel) {
        return null
    }

    const discordID = msg.author.id

    if (!argumentClean) {
        return `<@${discordID}>, zapomniałeś podać argument: free, premium`
    }

    if (['info'].includes(argumentClean)) {
        const embed = new EmbedBuilder()
            .setColor(8086271)
            .setAuthor({ name: `Komenda - Daily`, iconURL: `https://ttvu.link/logo512.png` })
            .setDescription('**Opis:** Odbieraj codziennie dodatkowe punkty.')
            .setThumbnail(`https://ttvu.link/logo512.png`)
            .addFields(
                { name: `❯ Użycie komendy:`, value: `!daily free` },
                { name: `❯ Argumenty:`, value: `free, premium` },
                { name: `❯ Aliasy:`, value: `Brak` }
            )
            .setImage(`https://ttvu.link/og-default.png`)
            .setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
            .setTimestamp()

        return { embeds: [embed] }
    }

    const userInfo = await getPoints(discordID, 'adrian1g__')

    if (userInfo === null || userInfo.points === null) {
        return `<@${discordID}>, najprawdopodobniej nie połączyłeś konta. Zrób to za pomoca wpisania ${'`!connectdc ' + discordID + '`'
            } na kanale [adrian1g__](https://twitch.tv/adrian1g__)`
    }

    if (!['free', 'premium'].includes(argumentClean)) {
        return `<@${discordID}>, nie jesteśmy w stanie rozpoznać tego daily`
    }

    if (['premium'].includes(argumentClean)) {
        const removePoints = await gambleUpdate("adrian1g__", `-1500`, userInfo.user_login)

        if (removePoints.points > userInfo.points) {
            return `<@${discordID}>, nie masz tylu punktów. Premium kosztuje 1500 punktów.`
        }
    }

    const drawedPoints = drawingPoints(argumentClean)

    const updatePoints = await gambleUpdate('adrian1g__', `+${drawedPoints}`, user)

    if (updatePoints === null) {
        return `<@${discordID}>, błąd podczas aktualizowania punktów, skontaktuj się z administratorem.`
    }

    return `@<@${discordID}>, udało Ci się wylosować ${drawedPoints} pkt! jasperGratulacje`
}
