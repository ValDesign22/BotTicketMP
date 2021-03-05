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
                const user = await client.users.fetch(`${message.channel.topic}`);

                const guildSupport = client.guilds.cache.find(g => g.id === `${client.config.guild}`);
                const channelTicketReaction = guildSupport.channels.cache.find(c => c.name === "🎟︙tickets");

                const e = new Discord.MessageEmbed()
                .setTitle("Ticket fermé")
                .setColor("#2F3136")
                .setDescription(`Ton ticket à été fermé par le support.\nSi tu as d'autres questions merci d'ouvrir un ticket içi: <#${channelTicketReaction.id}> ou en m'envoyant un message privé.`)

                await user.send(e);

                message.channel.delete();
            }
            else {
                return;
            }
        }
    }
}
