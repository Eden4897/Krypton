const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'softban',
    description: 'Softbans a user.',
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

        let reason = msg.content.slice(args[0].length + 10);

        if(!reason){
            reason = "undefined";
        }

        notif(member.user, `You have been softbanned from ${msg.guild.name} for: \`${reason}\`. You can rejoin if someone invites you.`)
        .then(async dm => {
            await member.ban({ days: 7, reason: reason })
            .then(async () => {
                await msg.guild.members.unban(member.id);
                success(msg.channel, `User <@!${member.id}> was softbanned.`);
            })
            .catch(async () => {
                error(msg.channel, `I can't softban user <@${member.id}>.`);
                if(dm) dm.delete();
            });
        })
        .catch(async () => {
            await member.ban({ days: 7, reason: reason })
            .then(async () => {
                await msg.guild.members.unban(member.id);
                success(msg.channel, `User <@!${member.id}> was softbanned. Their DMs were closed.`);
            })
            .catch(async () => {
                error(msg.channel, `I can't softban user <@${member.id}>.`);
                if(dm) dm.delete();
            });
        });
	},
}