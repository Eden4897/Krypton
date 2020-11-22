const {error, success, notif} = require("../utils/logging");
const Guild = require("../models/guild");

module.exports = {
    name: 'delwarn',
    description: 'Warns a user.',
    admin: true,
    args: 1,
	async execute(bot, msg, args) {
        const guild = await Guild.findOne({
            guildID: msg.guild.id
        });

        if(!guild.warns.some(warn => warn.id == args[0])){
            return error(msg.channel, `No warning with ID ${args[0]} found.`);
        }

        await Guild.findOneAndUpdate({
            guildID: msg.guild.id
        }, {
            $pull: {
                warns: {
                    id: parseInt(args[0])
                }
            }
        });
        
        success(msg.channel, `Warning ${args[0]} has been removed.`);
	},
}