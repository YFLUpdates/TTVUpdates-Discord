import CreateItem from "../requests/CreateItem.js";
import humanizeDuration from "humanize-duration";

import userData from "../requests/getPoints.js";
import pointsToVoid from "../requests/gambleUpdate.js";

import { aha, jasperSmiech } from "../functions/slots/data/discordEmotes.js";

//Fishing exclusive
import { CurrentTimeOfTheDay, FishPriceRolling, Passes, RodUpgrade, RodsList, RodsPricing } from "../functions/fish/index.js";
import { UpdatePass, UpdateRod } from "../requests/Fish/index.js";
import { FishCatch, FishPoolCatch, RollNumber } from "../functions/fish/Algorithm/index.js";
import { cases } from "../functions/fish/data/fishData.js";

export default async function commandFish(
    msg,
    argumentClean,
    args,
) {
    const gambleChannel = process.env.GAMBLE_CHANNEL;

    if (msg.channelId !== gambleChannel) {
        return null;
    }
    const discordID = msg.author.id;

    const userInfo = await userData(discordID, "adrian1g__");
    if (!userInfo) {
        return `<@${discordID}>, nie udało sie pobrać danych użytkownika.`;
    }

    const currentDate = new Date();
    const passDate = new Date(userInfo.fishing_pass);

    if (!argumentClean || ' 󠀀'.includes(argumentClean) || ' 󠀀'.includes(args[1])) {

        if (!userInfo.fishing_rod) {
            return `<@${discordID}>, Nie posiadasz wędki! Zakup za pomocą !fishing rod (Więcej na https://blog.ttvu.link/posts/fishing)`;
        }
        if (!userInfo.fishing_pass) {
            return `<@${discordID}>, Nie posiadasz karnetu! Zakup za pomocą !fishing pass (Więcej na https://blog.ttvu.link/posts/fishing)`;
        }

        if (passDate < currentDate) {
            return `<@${discordID}>, Twój karnet stracił ważność. Musisz kupić nowy, aby dalej łowić.`;
        }

        const currentTime = CurrentTimeOfTheDay();
        const FishData = cases.fishes[currentTime];
        const FishCatchNumber = await RollNumber();
        const doesFishCatch = FishCatch(FishData, userInfo.fishing_rod, FishCatchNumber);

        if (!doesFishCatch) {
            return `<@${discordID}>, Nie przypłynęła do ciebie żadna ryba ${jasperSmiech} `;
        }

        const FishPoolNumber = await RollNumber();
        const CatchedFish = FishPoolCatch(FishData, userInfo.fishing_rod, FishPoolNumber, cases.fishes.list_of_fish);

        if (CatchedFish === null) {
            return `<@${discordID}>, błąd podczas losowania ryby.`;
        }

        const fishPrice = FishPriceRolling(CatchedFish.from_price, CatchedFish.to_price);
        const addItem = await CreateItem(
            userInfo.user_login,
            `[${CatchedFish.rarity}] ${CatchedFish.name}`,
            fishPrice,
            CatchedFish.image,
            "adrian1g__",
            "fish"
        )

        if (addItem === null) {
            console.log("Catched Fish data", CatchedFish, FishPoolNumber);
            return `<@${discordID}>, błąd podczas dodawania ryby do ekwipunku, skontaktuj się z administratorem.`;
        }

        return `<@${discordID}>, Złapałeś/aś rybe: [${CatchedFish.rarity}] ${CatchedFish.name} ($${fishPrice}) (Ekwipunek: !eq)`;
    }

    if (["info", "pomoc"].includes(argumentClean)) {
        return `<@${discordID}>, Szczegółowy opis rozgrywki dostępny pod linkiem: https://blog.ttvu.link/posts/fishing`;
    }

    if (["rod"].includes(argumentClean)) {

        if (args.length < 2 || !args[1]) {
            if (!userInfo.fishing_rod) {
                return `<@${discordID}>, Aby zakupić/ulepszyć wędke, podaj argument: buy, upgrade`;
            }

            const currentRod = RodsList(userInfo.fishing_rod);

            if (!currentRod) {
                return `<@${discordID}>, Posiadasz nieznany rodzaj wędki.`
            }

            return `<@${discordID}>, Posiadasz aktualnie wędke: ${currentRod.title}`;
        }

        if (!["upgrade", "buy"].includes(args[1])) {
            return `<@${discordID}>, Nieznany rodaj argumentu! Dostępne: buy, upgrade`;
        }

        const newRod = RodUpgrade(userInfo.fishing_rod);

        if (!newRod) {
            return `<@${discordID}>, Posiadasz nieznany rodzaj wędki, Skontaktuj się z administratorem.`
        }

        if (newRod === "no_further_upgrade") {
            return `<@${discordID}>, Posiadasz już najlepsza dostępną wędke!`
        }

        const newRodPrice = RodsPricing(newRod);

        if (newRodPrice.price > userInfo.points) {
            return `<@${discordID}>, nie masz tylu punktów ${aha} `;
        }

        const updatePoints = await pointsToVoid(
            "adrian1g__",
            `-${newRodPrice.price}`,
            userInfo.user_login
        );

        if (updatePoints === null) {
            return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika.`;
        }

        const updatePass = await UpdateRod(userInfo.user_login, "adrian1g__", newRod);
        if (updatePass === null) {
            return `<@${discordID}>, nie udało sie zaktualizować wędki.`;
        }

        const upgradedRod = RodsList(newRod);
        if (!upgradedRod) {
            return `<@${discordID}>, Kupiłeś nieznany rodzaj wędki.`
        }

        return `<@${discordID}>, Pomyślnie udało ci się kupić nową wędke "${upgradedRod.title}". Udanych łowów!`;

    }

    if (["pass", "karnet"].includes(argumentClean)) {
        if (args.length < 2 || !args[1]) {

            if (!userInfo.fishing_pass) {
                return `<@${discordID}>, Nie kupiłeś/aś jeszcze żadnego karnetu. !fishing pass [30m/1h/2h]`;
            }

            if (passDate < currentDate) {
                return `<@${discordID}>, Twój karnet już się skończył, musisz kupić nowy aby dalej łowić.`;
            }

            const timeDifference = passDate.getTime() - currentDate.getTime();

            return `<@${discordID}>, Twój karnet wygasa za: ${humanizeDuration(Math.round(timeDifference), { language: "pl", round: true })}`;
        }

        if (!["30min", "30m", "1hour", "1h", "2hour", "2h"].includes(args[1])) {
            return `<@${discordID}>, Nieznany typ karnetu! Dostępne: 30m, 1h, 2h`;
        }

        if (!userInfo.fishing_rod) {
            return `<@${discordID}>, Hola hola! A gdzie zgubiłeś/aś wędke? !fishing rod buy`;
        }

        const getNewPassTime = Passes(args[1]);


        if (getNewPassTime.prices[userInfo.fishing_rod] > userInfo.points) {
            return `<@${discordID}>, Nie masz tylu punktów, cena karnetu: ${getNewPassTime.prices[userInfo.fishing_rod]} `;
        }

        const updatePoints = await pointsToVoid(
            "adrian1g__",
            `-${getNewPassTime.prices[userInfo.fishing_rod]}`,
            userInfo.user_login
        );

        if (updatePoints === null) {
            return `<@${discordID}>, nie udało sie zaktualizować punktów użytkownika.`;
        }

        const updatePass = await UpdatePass(userInfo.user_login, "adrian1g__", getNewPassTime.date.toJSON().slice(0, 19).replace("T", " "));
        if (updatePass === null) {
            return `<@${discordID}>, nie udało sie zaktualizować karnetu.`;
        }

        const timeDifference = getNewPassTime.date.getTime() - currentDate.getTime();

        return `<@${discordID}>, Pomyślnie udało ci się kupić karnet "${args[1]}", Pozostały czas: ${humanizeDuration(Math.round(timeDifference), { language: "pl", round: true })}`;
    }

    return `<@${discordID}>, Nieznany argument. Dostępne: pass, rod, info`;
}
