if(msg.channelId === "1075498439435104316" && msg.author.id !== "1071108766843556020"){
    if(Array.from(msg.attachments).length === 0){
      msg.delete();

      msg.channel.send(`» To nie jest zdjęcie <@${msg.author.id}>`).then(msg => setTimeout(() => msg.delete(), 5000));

      return;
    }

    msg.channel.send(`» <@${msg.author.id}>, twój zrzut ekranu oczekuje na weryfikację moderacji. <@&1006911102002671625> <@&1006910777728454686>`);

    return;

}