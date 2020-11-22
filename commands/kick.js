const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'kick',
    description: 'Kicks a user.',
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
            return error(msg.channel, `I can't find user ${args[0]}.`);
        }

        let reason = msg.content.slice(args[0].length + 7);

        if(!reason){
            reason = "undefined";
        }

        let dm;
        let isDmable = " Their DM was closed."

        await notif(member.user, `You have been kicked from ${msg.guild.name} for: \`${reason}\`. You can rejoin if someone invites you.`).then(m => {
            dm = m;
        }).catch(isDmable = "");

        await member.kick({ reason: reason })
        .then(async () => {
            success(msg.channel, `User <@!${member.id}> was kicked.${isDmable}`);
        })
        .catch(async () => {
            error(msg.channel, `I can't kick user <@${member.id}>.`);
            await dm;
            dm.delete();
        });
	},
}