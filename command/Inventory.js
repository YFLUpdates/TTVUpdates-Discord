import GetInventory from '../requests/getInventory.js'
import DeleteItem from '../requests/DeleteItem.js'
import CreateItem from '../requests/CreateItem.js'
import gambleUpdate from '../requests/gambleUpdate.js'
import getItem from '../requests/getItem.js'
import getPoints from '../requests/getPoints.js';
import WipeInventory from '../requests/WipeInventory.js';

import { EmbedBuilder } from "discord.js";

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

	if (['info'].includes(argumentClean)) {
		const embed = new EmbedBuilder()
			.setColor(8086271)
			.setAuthor({ name: `Komenda - Ekwipunek`, iconURL: `https://ttvu.link/logo512.png` })
			.setDescription('**Opis:** Pokazuje co udało Ci się zdobyć oraz pozwala sprzedać itemy.')
			.setThumbnail(`https://ttvu.link/logo512.png`)
			.addFields(
				{ name: `❯ Użycie komendy:`, value: `!eq\n!eq 3xanax\n!eq sell 34\n!eq trade 69 3xanax` },
				{ name: `❯ Argumenty:`, value: `user, sell, trade, id` },
				{ name: `❯ Aliasy:`, value: `!ekwipunek, !inventory, !inv` }
			)
			.setImage(`https://ttvu.link/og-default.png`)
			.setFooter({ text: `TTVUpdates - Discord Port`, iconURL: `https://ttvu.link/logo512.png` })
			.setTimestamp()

		return { embeds: [embed] };
	}

	//Trade item
	if (['trade'].includes(argumentClean)) {
		if (!args || args.length < 2) {
			return `<@${discordID}>, zapomniałeś/aś o ID przedmiotu.`
		}

		if (!args || args.length < 3) {
			return `<@${discordID}>, zapomniałeś/aś o nicku osoby.`
		}

		const itemID = args[1];
		const tradeTo = args[2];

		if (tradeTo === discordID) {
			return `<@${discordID}>, nie możesz sobie samemu wysłać przedmiotu.`
		}

		const points = await getPoints(discordID, "adrian1g__");

		if (points === null || points.points === null) {
			return `<@${discordID}>, najprawdopodobniej nie połączyłeś konta. Zrób to za pomoca wpisania ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
		}

		const itemInfo = await getItem(points.user_login, itemID);
		if (itemInfo === null) {
			return `<@${discordID}>, nie posiadasz przedmiotu o takim ID.`
		}

		const removeItem = await DeleteItem(points.user_login, itemID);
		if (removeItem === null) {
			return `<@${discordID}>, nie udało się przesłać przedmiotu.`
		}

		const addItem = await CreateItem(
			tradeTo,
			itemInfo.item,
			itemInfo.price,
			itemInfo.img,
			"adrian1g__",
		)

		if (addItem === null) {
			return `<@${discordID}>, błąd podczas dodawania przedmiotu odbierającemu, skontaktuj się z administratorem.`
		}

		return `<@${discordID}>, ${itemInfo.item} (${compactNumber(itemInfo.price)} pkt) [id: ${itemInfo.id}] został przesłany do ${tradeTo}.`
	}


	// //Sell Items
	if (['sell', 'sprzedaj'].includes(argumentClean)) {
		if (!args || args.length < 2) {
			return `<@${discordID}>, zapomniałeś/aś o ID przedmiotu.`
		}

		const points = await getPoints(discordID, "adrian1g__");

		if (points === null || points.points === null) {
			return `<@${discordID}>, najprawdopodobniej nie połączyłeś bota ze swoim kontem ${"`!connectdc " + discordID + "`"} na kanale [adrian1g__](https://twitch.tv/adrian1g__)`;
		}

		///////////////////////////
		///////////////////////////
		///////////////////////////
		///////////////////////////
		///////////////////////////


		if (args[1] === "all") {
			const getItems = await GetInventory(points.user_login, "adrian1g__")
			if (getItems === null) {
				return `<@${discordID}>, Twój ekwipunek jest pusty`
			}

			const result = getItems.reduce((acc, item) => {
				acc.ids.push(item.id);
				acc.totalPrices += item.price;
				return acc;
			}, { ids: [], totalPrices: 0 });

			if (!result.totalPrices || result.totalPrices && isNaN(Number(result.totalPrices))) {
				console.log("here")
				return `<@${discordID}>, nie udało się sprzedać przedmiotów.`;
			}


			const removeItem = await WipeInventory(points.user_login, result.ids);
			if (removeItem === null) {
				console.log("not here")
				return `<@${discordID}>, nie udało się sprzedać przedmiotów.`;
			}

			const updatePoints = await gambleUpdate(
				"adrian1g__",
				`+${result.totalPrices}`,
				points.user_login
			);

			if (updatePoints === null) {
				return `<@${discordID}>, błąd podczas aktualizowania punktów, skontaktuj się z administratorem.`;
			}

			return `<@${discordID}>, sprzedałeś wszystkie itemy za ${compactNumber(result.totalPrices)} pkt`
		}


		///////////////////////////
		///////////////////////////
		///////////////////////////
		///////////////////////////
		///////////////////////////

		const itemID = args[1];
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
		.slice(0, 1)
		.map(e => `${e.item} (${compactNumber(e.price)} pkt) [id: ${e.id}]`)
		.join()} - pełna rozpiska na https://ttvu.link/${argumentClean}`
}
