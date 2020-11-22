const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'kick',
    description: 'Kicks a user',
    usage: "{p}kick [user] (reason)",
    example: "{p}kick <@401376663541252096>\n{p}kick Eden Bye!\n{p}kick 401376663541252096",
    admin: true,
    args: 1,
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

        let reason = msg.content.slice(args[0].length + 7);

        if(!reason){
            reason = "undefined";
        }

        notif(member.user, `You have been kicked from ${msg.guild.name} for: \`${reason}\`. You can rejoin if someone invites you.`)
        .then(async dm => {
            await member.kick({ reason: reason })
            .then(async () => {
                success(msg.channel, `User <@!${member.id}> was kicked.`);
            })
            .catch(async () => {
                error(msg.channel, `I can't kick user <@${member.id}>.`);
                if(dm) dm.delete();
            });
        })
        .catch(async () => {
            await member.kick({ reason: reason })
            .then(async () => {
                success(msg.channel, `User <@!${member.id}> was kicked. Their DMs were closed.`);
            })
            .catch(async () => {
                error(msg.channel, `I can't kick user <@${member.id}>.`);
            });
        });
	},
}