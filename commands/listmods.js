const { MessageEmbed } = require("discord.js");
const {error, success} = require("../utils/logging");
const Guild = require("../models/guild");

module.exports = {
    name: 'listmods',
    description: 'List all mods',
    usage: "{p}listmods",
    example: "{p}listmods",
    admin: true,
    args: 0,
	async execute(bot, msg, args, help) {
        const settings = await Guild.findOne({
            guildID: msg.guild.id
        })

        const mods = settings.mods;
        const managers = msg.guild.roles.cache.filter(role => role.permissions.has("MANAGE_GUILD"));

        if(!mods){
            return error(msg.channel, "There are currently no mod roles in this server.");
        }
        else{
            let rolestring = "";
            managers.forEach(manager => {
                if(mods.includes(manager.id)) return;
                rolestring += `<@&${manager.id}>\n`;
            });
            mods.forEach(mod => {
                rolestring += `<@&${mod}>\n`;
            });

            const embed = new MessageEmbed()
            .setTitle("Mod roles")
            .setDescription(rolestring)
            .setColor("#3B88C3");

            await msg.channel.send(embed);
        }
    },
}