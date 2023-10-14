import GetInventory from '../requests/getInventory.js'
import DeleteItem from '../requests/DeleteItem.js'
import gambleUpdate from '../requests/gambleUpdate.js'
import getItem from '../requests/getItem.js'
import getPoints from '../requests/getPoints.js';

const compactNumber = (_) => Intl.NumberFormat('en', { notation: 'compact' }).format(_);

export default async function commandInventory(msg, argumentClean, args) {
	const gambleChannel = process.env.GAMBLE_CHANNEL;

	if (msg.channelId !== gambleChannel) {
		return null;
	}

	const discordID = msg.author.id;

	if (!argumentClean) {
		const points = await getPoints(discordID, "adrian1g__");

		if (points === null || points.points === null) {
			return `<@${discordID}>, najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale adrian1g__`;
		}

		const viewer = await GetInventory(points.user_login, 'adrian1g__');
		if (viewer === null) {
			return `<@${discordID}>, nie udało sie pobrać ekwipunku użytkownika, bądź ekwipunek jest pusty.`
		}

		if (viewer.length >= 5) {
			return `<@${discordID}>, posiadasz w swoim ekwipunku: ${viewer
				.slice(0, 5)
				.map(e => `${e.item} (${compactNumber(e.price)} pkt) [id: ${e.id}]`)
				.join(', ')}, +${viewer.length - 5} ( Zaloguj się na https://ttvu.link/inventory )`
		}

		return `<@${discordID}>, posiadasz w swoim ekwipunku: ${viewer
			.map(e => `${e.item} (${compactNumber(e.price)} pkt) [id: ${e.id}]`)
			.join(', ')} ( Zaloguj się na https://ttvu.link/inventory )`
	}

	// //Sell Items
	if (['sell', 'sprzedaj'].includes(argumentClean)) {
		if (!args || args.length < 2) {
			return `<@${discordID}>, zapomniałeś/aś o ID przedmiotu.`
		}

		const itemID = args[1];
		const points = await getPoints(discordID, "adrian1g__");

		if (points === null || points.points === null) {
			return `<@${discordID}>, najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale adrian1g__`;
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

	if (viewer.length >= 5) {
		return `<@${discordID}>, ${argumentClean} posiada w swoim ekwipunku: ${viewer
			.slice(0, 5)
			.map(e => `${e.item} (${compactNumber(e.price)} pkt) [id: ${e.id}]`)
			.join(', ')}, +${viewer.length - 5} ( Zaloguj się na https://ttvu.link/${argumentClean} )`
	}

	return `<@${discordID}>, ${argumentClean} posiada w swoim ekwipunku: ${viewer
		.map(e => `${e.item} (${compactNumber(e.price)} pkt) [id: ${e.id}]`)
		.join(', ')} ( Zaloguj się na https://ttvu.link/${argumentClean} )`
}
