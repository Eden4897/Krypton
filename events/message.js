const Guild = require("../models/guild");
const { defaultGuild } = require("../models/guild");
const {error, notif, success} = require("../utils/logging");
const { MessageEmbed } = require("discord.js");

module.exports = async (bot, msg) => {
    if(msg.author.bot) return;

    const settings = await Guild.findOne({
        guildID: msg.guild.id
    }, (err, guild) => {
        if (err) console.error(err);

        if (!guild){
            const newGuild = new Guild(defaultGuild(msg.guild));

            newGuild.save()
            .catch(err => console.error(err));

            notif(msg.channel, "This server was not in our database! We have just added it.");
        }
    });

    if(!settings) return;

    const PREFIX = settings.prefix;

    let args = msg.content.substring(PREFIX.length).split(" ");
    let message = msg.content.substring(0);

    for (var i = 0; i < args.length; i++){
        var a = args[i].split("+");
        if(a.length > 1){
            args[i] = a.join(" ");
        }
    }

    if(message.substring(0, PREFIX.length) == PREFIX){
        if (bot.commands.has(args[0])){
            try {
                if(bot.commands.get(args[0]).admin && !await bot.isMod(msg.member)){
                    return error(msg.channel, "Access denied.");
                }
                const command = bot.commands.get(args[0]);

                let description = "**Description: **";
                description += command.description.replace(/{p}/g, PREFIX);
                description += "\n";

                description += "**Usage: **";
                if(command.usage.includes("\n")){
                    description += "\n";
                }
                description += command.usage.replace(/{p}/g, PREFIX);
                description += "\n";

                description += "**Examples: **";
                if(command.example.includes("\n")){
                    description += "\n";
                }
                description += command.example.replace(/{p}/g, PREFIX);

                const embed = new MessageEmbed()
                .setTitle(`Command: ${PREFIX}${args[0]}`)
                .setDescription(description);

                if(args.length - 1 < bot.commands.get(args[0]).args){
                    return msg.channel.send(embed);
                }
                await bot.commands.get(args[0]).execute(bot, msg, args.slice(1), embed);

            } catch (err) {
                console.error(err);
                error(msg.channel, `There was an error trying to execute the ${args[0]} command!`);
            }
        }
    }
};