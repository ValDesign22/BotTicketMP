const Discord = require("discord.js");

module.exports = async(client, message) => {
    //Ignore bots
    if (message.author.bot) return;

    //Ticket mp system
    if(message.channel.type === "dm") {
        const msg = message.content;

        const guild = client.guilds.cache.find(g => g.id === client.config.guild);

        let categorie = guild.channels.cache.find(c => c.name == "Tickets" && c.type == "category");
        if (!categorie) categorie = await guild.channels.create("Tickets", { type: "category", position: 1 }).catch(e => { return console.error(e) });
        
        const supportRole = guild.roles.cache.find(r => r.id === `${client.config.support}`);

        if (!guild.channels.cache.find(c => c.name === `${message.author.id}-mp`)) {
            guild.channels.create(`${message.author.id}-mp`, {
                permissionOverwrites: [
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        id: supportRole.id
                    },
                ],
                parent: categorie.id,
                topic: `${message.author.tag}`
            })
            .then(ch => {
                const e = new Discord.MessageEmbed()
                .setTitle("Un membre demande de l'aide")
                .setColor("#2F3136")
                .setDescription(`Utilisateur: ${message.author.tag}\nID: ${message.author.id}`)
                .setFooter("Merci de cliquer sur 🔒 pour fermer le ticket.")
                .addField("Sa question:", msg)

                if (message.attachments.size > 0) {
                    e.setImage(message.attachments.first().attachment)
                }
                else {
                    e.setImage(null)
                }

                ch.send(e)
                .then(msg => {
                    msg.react("🔒")
                })
            })
        }
        else {
            const channelTicket = guild.channels.cache.find(c => c.name === `${message.author.id}-mp`)

            const e = new Discord.MessageEmbed()
            .setTitle("Une nouvelle question")
            .setColor("#2F3136")
            .addField("Sa question:", msg)

            if (message.attachments.size > 0) {
                e.setImage(message.attachments.first().attachment)
            }
            else {
                e.setImage(null)
            }

            channelTicket.send(e)
        }
    }
    else {
        if (message.channel.name.endsWith("-mp")) {
            const msg = message.content

            const user = await client.users.fetch(`${message.channel.topic}`)

            const e = new Discord.MessageEmbed()
            .setTitle("Réponse du staff")
            .setColor("#2F3136")
            .addField(`${message.author.tag}`, msg)

            const e2 = new Discord.MessageEmbed()
            .setTitle(message.author.tag)
            .setColor("#2F3136")
            .setDescription(msg)

            if (message.attachments.size > 0) {
                e.setImage(message.attachments.first().attachment)
                e2.setImage(message.attachments.first().attachment)
            }
            else {
                e.setImage(null)
                e2.setImage(null)
            }
            
            message.channel.send(e2)

            await user.send(e)
            .then(msg => {
                msg.react("📥")
            })

            message.delete()
        }
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
