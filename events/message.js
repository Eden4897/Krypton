const Guild = require("../models/guild");
const { defaultGuild } = require("../models/guild");
const {error, notif, success} = require("../utils/logging");

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
                if(args.length - 1 < bot.commands.get(args[0]).args){
                    return error(msg.channel, "Insufficant parameters.");
                }
                await bot.commands.get(args[0]).execute(bot, msg, args.slice(1));

            } catch (err) {
                console.error(err);
                error(msg.channel, `There was an error trying to execute the ${args[0]} command!`);
            }
        }
    }
};