const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'ban',
    description: 'Bans a user.',
    admin: true,
    args: 1,
	async execute(bot, msg, args) {
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
            return error(msg.channel, `I can't find user ${args[0]}`);
        }

        let reason = msg.content.slice(args[0].length + 6);

        if(!reason){
            reason = "undefined";
        }

        let dm;
        let isDmable = " Their DM was closed."

        await notif(member.user, `You have been banned from ${msg.guild.name} for: \`${reason}\`.`).then(m => {
            dm = m;
        }).catch(isDmable = "");

        await member.ban({ days: 7, reason: reason })
        .then(async () => {
            success(msg.channel, `User <@!${member.id}> was banned.${isDmable}`);
        })
        .catch(async () => {
            error(msg.channel, `I can't ban <@${member.id}>.`);
            await dm;
            dm.delete();
        });
	},
}