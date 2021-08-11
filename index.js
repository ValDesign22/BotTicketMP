//All modules
const fs = require("fs");
const Discord = require("discord.js");

//Define the client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

//Configs
const config = require("./config.json");
client.config = config;

//Load all events
fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Event: ${eventName}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
    console.log(`${files.length} events`)
});

//Login the bot
client.login(client.config.token)
