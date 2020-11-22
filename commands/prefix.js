const {error, success} = require("../utils/logging");
const Guild = require("../models/guild");

module.exports = {
    name: 'prefix',
    description: 'Changes the prefix of the server',
    usage: "{p}prefix [New Prefix]",
    example: "{p}prefix ?\n{p}prefix krypton",
    admin: true,
    args: 1,
	async execute(bot, msg, args, help) {
        await Guild.findOneAndUpdate({
            guildID: msg.guild.id
        }, {
            prefix: args[0]
        });

        success(msg.channel, `This server's prefix has been updated to \`${args[0]}\``);
    },
}
