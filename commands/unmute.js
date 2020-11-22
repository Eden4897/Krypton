const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'unmute',
    description: 'Unmutes a user.',
    admin: true,
    args: 1,
	async execute(bot, msg, args) {
        let role = await msg.guild.roles.cache.find(r => r.name == "Muted");

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
        
        if(member.roles.cache.some(r => r.id == role.id)){
            member.roles.remove(role)
            .then(async () => {
                await success(msg.channel, `<@${member.id}> has been unmuted.`);
            })
            .catch(async () => {
                await error(msg.channel, `I cannot unmute <@${member.id}>.`);
            })
        }else{
            await notif(msg.channel, `<@${member.id}> is not muted!`);
        }
	},
}