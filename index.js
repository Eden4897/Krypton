const Discord = require("discord.js");
const fs = require("fs");
const { config } = require("dotenv");

config({
    path: `${__dirname}/.env`
});

const bot = new Discord.Client();
module.exports.bot = bot;
bot.commands = new Discord.Collection();
bot.mongoose = require("./utils/mongoose");

fs.readdir("./commands/", (err, files) => {
    if(err) return console.error;
    files.forEach(file => {
        if(!file.endsWith(".js")) return;
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
        console.log(`Loaded command \x1b[35m${command.name}\x1b[0m.`);
    })  
});

fs.readdir("./events/", (err, files) => {
    if(err) return console.error;
    files.forEach(file => {
        if(!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        const eventName = file.split(".")[0];
        bot.on(eventName, event.bind(null, bot));
        console.log(`Loaded event \x1b[35m${eventName}\x1b[0m.`);
    })  
});

bot.mongoose.init();
bot.login(process.env.TOKEN);