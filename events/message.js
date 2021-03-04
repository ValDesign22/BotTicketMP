const Discord = require("discord.js");

module.exports = async(client, message) => {
    //Ignore bots
    if (message.author.bot) return;

    //Ticket mp system
    if(message.channel.type === "dm") {
        //Get image from message
        let Attachment = (message.attachments).array();
        
        //Message to send to support
        const msg = message.content;
        
        //Guild support
        const guild = client.guilds.cache.find(g => g.id === client.config.guild);
        
        //Category of all tickets
        let categorie = guild.channels.cache.find(c => c.name == "Tickets" && c.type == "category");
        if (!categorie) categorie = await guild.channels.create("Tickets", { type: "category", position: 1 }).catch(e => { return console.error(e) });
        
        //If the ticket channel not exist
        if (!guild.channels.cache.find(c => c.name === `${message.author.id}-mp`)) {
            guild.channels.create(`${message.author.id}-mp`, {
                permissionOverwrites: [
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        id: message.author.id
                    },
                ],
                parent: categorie.id,
                topic: `${message.author.id}`
            })
            .then(ch => {
                const e = new Discord.MessageEmbed()
                .setTitle("Un membre demande de l'aide")
                .setColor("#2F3136")
                .setDescription(`Utilisateur: ${message.author.tag}\nID: ${message.author.id}`)
                .setFooter("Merci de cliquer sur 🔒 pour fermer le ticket.")
                .addField("Sa question:", msg)
                
                //If image then setImage the embed
                if (Attachment[0].url.toUpperCase().endsWith('.PNG') || Attachment[0].url.toUpperCase().endsWith('.JPG') || Attachment[0].url.toUpperCase().endsWith('.JPEG') || Attachment[0].url.toUpperCase().endsWith('.WEBP')) {
                    e.setImage(Attachment[0].url)
                }

                ch.send(e)
                .then(msg => {
                    msg.react("🔒")
                })
            })
        }
        //If the ticket channel exist
        else {
            const channelTicket = guild.channels.cache.find(c => c.name === `${message.author.id}-mp`)

            const e = new Discord.MessageEmbed()
            .setTitle("Une nouvelle question")
            .setColor("#2F3136")
            .addField("Sa question:", msg)

            channelTicket.send(e)
        }
    }
    //In the support guild
    else {
        //If the channel name ends with "-mp"
        if (message.channel.name.endsWith("-mp")) {
            //The staff message
            const msg = message.content
            
            //Delete the staff message
            message.delete()
            
            //Staff message in an embed
            const e2 = new Discord.MessageEmbed()
            .setTitle(message.author.tag)
            .setColor("#2F3136")
            .setDescription(msg)

            message.channel.send(e2)
            
            //Define the user
            const user = await client.users.fetch(`${message.channel.topic}`)
            
            //Embed to send to user
            const e = new Discord.MessageEmbed()
            .setTitle("Réponse du staff")
            .setColor("#2F3136")
            .addField(`${message.author.tag}`, msg)

            await user.send(e)
            .then(msg => {
                msg.react("📥")
            })
        }
        //If not mp channel or ticket channel
        else {
            //Ignore message starting with not prefix
            if (message.content.indexOf(client.config.prefix) !== 0) return;
  
            //Define args and command
            const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
  
            //Get the command
            const cmd = client.commands.get(command);
  
            //If the bot doesn't have the command
            if (!cmd) return;
  
            //Run the command
            cmd.run(client, message, args);
        }
    }
};
