import GetInventory from '../requests/getInventory.js'
import DeleteItem from '../requests/DeleteItem.js'
import gambleUpdate from '../requests/gambleUpdate.js'
import getItem from '../requests/getItem.js'
import getPoints from '../requests/getPoints.js';

import { EmbedBuilder } from "discord.js";

const compactNumber = (_) => Intl.NumberFormat('en', { notation: 'compact' }).format(_);

export default async function commandInventory(msg, argumentClean, args) {
	const gambleChannel = process.env.GAMBLE_CHANNEL;

	if (msg.channelId !== gambleChannel) {
		return null;
	}

	const discordID = msg.author.id;

	if (['info'].includes(argumentClean)) {
		const embed = new EmbedBuilder()
			.setColor(8086271)
			.setAuthor({ name: `Komenda - Case`, iconURL: `https://ttvu.link/logo512.png` })
			.setDescription('**Opis:** Pokazuje co udało Ci się zdobyć oraz pozwala sprzedać itemy.')
			.setThumbnail(`https://ttvu.link/logo512.png`)
			.addFields(
				{ name: `❯ Użycie komendy:`, value: `!eq\n!eq sell 34` },
				{ name: `❯ Argumenty:`, value: `sell` },
				{ name: `❯ Aliasy:`, value: `!ekwipunek, !inventory, !inv` }
			)
			.setImage(`https://ttvu.link/og-default.png`)
			.setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
			.setTimestamp()

		return msg.channel.send({ embeds: [embed] })
	}

	if (!argumentClean) {
		const points = await getPoints(discordID, "adrian1g__");

		if (points === null || points.points === null) {
			return `<@${discordID}>, najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
		}

		const viewer = await GetInventory(points.user_login, 'adrian1g__');
		if (viewer === null) {
			return `<@${discordID}>, nie udało sie pobrać ekwipunku użytkownika, bądź ekwipunek jest pusty.`
		}

		return `<@${discordID}>, posiadasz w swoim ekwipunku: ${viewer
			.slice(0, 1)
			.map(e => `${e.item} (${compactNumber(e.price)} pkt) [id: ${e.id}]`)
			.join()} - pełna rozpiska na https://ttvu.link/${points.user_login}`
	}

	// //Sell Items
	if (['sell', 'sprzedaj'].includes(argumentClean)) {
		if (!args || args.length < 2) {
			return `<@${discordID}>, zapomniałeś/aś o ID przedmiotu.`
		}

		const itemID = args[1];
		const points = await getPoints(discordID, "adrian1g__");

		if (points === null || points.points === null) {
			return `<@${discordID}>, najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
		}

		const itemInfo = await getItem(points.user_login, itemID);
		if (itemInfo === null) {
			return `<@${discordID}>, nie posiadasz przedmiotu o takim ID.`
		}

		const removeItem = await DeleteItem(points.user_login, itemID);
		if (removeItem === null) {
			return `<@${discordID}>, nie udało się sprzedać przedmiotu.`
		}

		const updatePoints = await gambleUpdate('adrian1g__', `+${itemInfo.price}`, points.user_login);

		if (updatePoints === null) {
			return `<@${discordID}>, błąd podczas aktualizowania punktów, skontaktuj się z administratorem.`
		}

		return `<@${discordID}>, Item ${itemInfo.item} został sprzedany za ${itemInfo.price} pkt.`
	}


	const viewer = await GetInventory(argumentClean, 'adrian1g__');
	if (viewer === null) {
		return `<@${discordID}>, nie udało sie pobrać ekwipunku użytkownika, bądź ekwipunek jest pusty.`
	}

	return `<@${discordID}>, ${argumentClean} posiada w swoim ekwipunku: ${viewer
		.slice(0, 0)
		.map(e => `${e.item} (${Intl.NumberFormat('en', { notation: 'compact' }).format(e.price)} pkt) [id: ${e.id}]`)
		.join()} - pełna rozpiska na https://ttvu.link/${argumentClean}`
}
