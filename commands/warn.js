const {error, success, notif} = require("../utils/logging");
const Guild = require("../models/guild");

module.exports = {
    name: 'warn',
    description: 'Warns a user',
    usage: "{p}warn [user] [reason]",
    example: "{p}warn <@401376663541252096> Disrespecful\n{p}warn Eden No swearing\n{p}warn 401376663541252096 Posting advertisements",
    admin: true,
    args: 2,
	async execute(bot, msg, args, help) {
        let member;
        if(msg.mentions.members.first()){
            // Find member by mentioning
            member = msg.mentions.members.first();
        }

        if(!member){
            // Find member by name
            member = msg.guild.members.cache.find(member => member.user.username == args[0]);
        }

        if(!member){
            // Find member by ID
            member = msg.guild.members.cache.get(args[0]);
        }

        if(!member){
            return error(msg.channel, `I can't find user ${args[0]}.`);
        }

        const reason = msg.content.slice(args[0].length + 7);

        const settings = await Guild.findOne({
            guildID: msg.guild.id
        });

        await settings.updateOne({
            $push: {
                warns: {
                    id: settings.lastWarnID + 1,
                    userID: member.id,
                    modID: msg.member.id,
                    reason: reason
                }
            },
            lastWarnID: settings.lastWarnID + 1
        });

        notif(member, `You have been warned in ${msg.guild.name} for: **${reason}**.`)
        .then(() => {
            success(msg.channel, `${member.user.tag} has been warned. ID: ${settings.lastWarnID + 1}`);
        })
        .catch(() => {
            success(msg.channel, `${member.user.tag} has been warned. Their DMs were closed. ID: ${settings.lastWarnID + 1}`);
        });
	},
}