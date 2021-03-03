const Discord = require("discord.js");

module.exports = async (client, reaction, user) => {
    //Ignore if the react author is a bot
    if (user.bot) {
        return
    }
    else {
        //Get message frome reaction (reaction.message => message)
        const { message } = reaction

        //Close a ticket if the channel name ends with -mp
        if (reaction.emoji.name === "🔒") {
            if (message.channel.name.endsWith("-mp")) {
                message.channel.delete()
            }
            else {
                return;
            }
        }
    }
}