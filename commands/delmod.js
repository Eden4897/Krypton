const {error, success} = require("../utils/logging");
const mongoose = require("mongoose");
const Guild = require("../models/guild");

module.exports = {
    name: 'delmod',
    description: 'Removes a role as a mod',
    usage: "{p}delmod [role]",
    example: "{p}delmod @Mods\n{p}delmod 780068153937887303\n{p}delmod Moderators",
    admin: true,
    args: 1,
	async execute(bot, msg, args, help) {
        let mod = null;
        if(msg.mentions.roles.first()){
            mod = msg.mentions.roles.first();
        }

        if(!mod){
            mod = msg.guild.roles.cache.find(role => role.name == args[0]);
        }

        if(!mod){
            mod = msg.guild.roles.cache.get(args[0]);
        }

        if(!mod){
            return error(msg.channel, `I can't find role ${args[0]}.`);
        }

        await Guild.findOneAndUpdate({
            guildID: msg.guild.id
        }, {
            $pull: {
                mods: mod.id
            }
        });

        success(msg.channel, `Role ${args[0]} had been removed from the list of mods.`);
    },
}