const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'mute',
    description: 'Mutes a user.',
    admin: true,
    args: 1,
	async execute(bot, msg, args) {
        let role = await msg.guild.roles.cache.find(r => r.name == "Muted");

        if(!role){
            await msg.guild.roles.create({
                data: {
                    name: "Muted",
                    color: "#546E7A",
                    hoist: false,
                    metionable: false
                }
            }).then(async r => {
                msg.guild.channels.cache.forEach(channel => {
                    channel.createOverwrite(r, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false
                    })
                });

                role = r;
            })
            .catch();

            if(!role){
                return error(msg.channel, `I cannot create the role! Please make sure I have \`Manage Roles\` and \`Manage Channels\` permissions.`);
            }
        }

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
            return notif(msg.channel, `<@${member.id}> was already muted.`)
        }

        if(bot.isMod(member)){
            return error(msg.channel, `<@${member.id}> is a mod; i cannot mute them.`)
        }

        await member.roles.add(role)
        .then(async () => {
            await success(msg.channel, `<@${member.id}> is muted.`);
        })
        .catch(async () => {
            await error(msg.channel, `I do not have the permissions to mute <@${member.id}>.`);
        })
	},
}