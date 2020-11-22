const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'tempban',
    description: 'Temporarily bans a user',
    usage: "{p}tempban [user] [time] (reason)",
    example: "{p}tempban <@401376663541252096> 20d See you later\n{p}tempban Eden 20s\n{p}tempban 401376663541252096 90m\m{p}tempban Eden 8h Go to sleep",
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
            return error(msg.channel, `I can't find user ${args[0]}`);
        }

        let reason = msg.content.slice(args[0].length + 6);

        if(!reason){
            reason = "undefined";
        }

        let duration = 0;

        const durationText = args[1].substring(0, args[1].length - 1);
        const durationUnit = args[1].substring(args[1].length - 1, args[1].length);

        if(!parseInt(durationText)) return msg.channel.send(help);
        if(parseInt(durationText) < 0) return msg.channel.send(help);
        
        switch(durationUnit){
            case "s":
                duration = parseInt(durationText) * 1000;
            break;
            case "m":
                duration = parseInt(durationText) * 60 * 1000;
            break;
            case "h":
                duration = parseInt(durationText) * 60 * 60 * 1000;
            break;
            case "d":
                duration = parseInt(durationText) * 24 * 60 * 60 * 1000;
            break;
            default:
                return msg.delete();
        }

        notif(member.user, `You have been banned from ${msg.guild.name} for: \`${reason}\`.`)
        .then(async dm => {
            await member.ban({ days: 7, reason: reason })
            .then(async () => {
                success(msg.channel, `User <@!${member.id}> was banned.`);

                setTimeout(()=>{
                    msg.guild.members.unban(member.id).catch();
                }, duration);
            })
            .catch(async () => {
                error(msg.channel, `I can't kban user <@${member.id}>.`);
                if(dm) dm.delete();
            });
        })
        .catch(async () => {
            await member.ban({ days: 7, reason: reason })
            .then(async () => {
                success(msg.channel, `User <@!${member.id}> was banned. Their DMs were closed.`);

                setTimeout(()=>{
                    msg.guild.members.unban(member.id).catch();
                }, duration);
            })
            .catch(async () => {
                error(msg.channel, `I can't ban user <@${member.id}>.`);
            });
        });
	},
}