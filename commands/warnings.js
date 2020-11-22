const {error, success, notif} = require("../utils/logging");
const Guild = require("../models/guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'warnings',
    description: 'List all warnings of a user.',
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

        const guildSettings = await Guild.findOne({
            guildID: msg.guild.id
        });

        const warnings = guildSettings.warns.filter(warning => warning.userID == member.id);

        if(warnings.length <= 0){
            return notif(msg.channel, `There are no warnings for <@${member.id}>.`);
        }

        let embed = new MessageEmbed()
        .setAuthor(`${warnings.length} warnings(s) for ${member.user.tag}.`,member.user.displayAvatarURL());

        warnings.forEach(warning => {
            const modUser = msg.guild.members.cache.get(warning.modID).user;
            embed.addField(`ID: ${warning.id} | Mod: ${modUser.tag}`, `${warning.reason} - ${warning.createdAt.toString().substring(4, 15)}`);
            console.log(`${new Date(warning.createdAt)}`);
        });

        msg.channel.send(embed);
	},
}