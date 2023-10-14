import GetInventory from '../requests/getInventory.js'
import DeleteItem from '../requests/DeleteItem.js'
import gambleUpdate from '../requests/gambleUpdate.js'
import getItem from '../requests/getItem.js'

export default async function commandInventory(msg, argumentClean, args) {
  const gambleChannel = "930091725823828031";

  if (msg.channelId !== gambleChannel) {
    return null;
  }

  const discordID = msg.author.id;

	//7TV Additional Space (antispam)
	if (' 󠀀'.includes(argumentClean)) {
		return null
	}

	//Sell Items
	if (['sell'].includes(argumentClean)) {
		if (!args || args.length < 2) {
			return `<@${discordID}>, zapomniałeś/aś o ID przedmiotu.`
		}

		const itemID = args[1]
		const itemInfo = await getItem(user, itemID)
		if (itemInfo === null) {
			return `<@${discordID}>, nie posiadasz przedmiotu o takim ID.`
		}

		const removeItem = await DeleteItem(user, itemID)
		if (removeItem === null) {
			return `<@${discordID}>, nie udało się sprzedać przedmiotu.`
		}

		const updatePoints = await gambleUpdate('adrian1g__', `+${itemInfo.price}`, user)

		if (updatePoints === null) {
			return `<@${discordID}>, błąd podczas aktualizowania punktów, skontaktuj się z administratorem.`
		}

		return `<@${discordID}>, Item ${itemInfo.item} został sprzedany za ${itemInfo.price}pkt.`
	}

	//Inventory preview
	const userName = argumentClean ? argumentClean : discordID

	const viewer = await GetInventory(userName, 'adrian1g__')

	if (viewer === null) {
		return `<@${discordID}>, nie udało sie pobrać ekwipunku użytkownika, bądź ekwipunek jest pusty.`
	}

	if (viewer.length >= 5) {
		return `<@${discordID}>, posiada w swoim ekwipunku: ${viewer
			.slice(0, 5)
			.map(e => `${e.item} (${Intl.NumberFormat('en', { notation: 'compact' }).format(e.price)} pkt) [id: ${e.id}]`)
			.join(', ')}, +${viewer.length - 5} (Zaloguj się na https://ttvu.link/inventory )`
	}

	return `<@${discordID}>, posiada w swoim ekwipunku: ${viewer
		.map(e => `${e.item} (${Intl.NumberFormat('en', { notation: 'compact' }).format(e.price)} pkt) [id: ${e.id}]`)
		.join(', ')} (Zaloguj się na https://ttvu.link/inventory )`
}
