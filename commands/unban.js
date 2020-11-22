const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'unban',
    description: 'Unbans a user',
    usage: "{p}unban [user ID]",
    example: "{p}unban 401376663541252096",
    admin: true,
    args: 1,
	async execute(bot, msg, args, help) {
        await msg.guild.members.unban(args[0])
        .then(async () => {
            success(msg.channel, `User <@!${args[0]}> was unbanned.`);
        })
        .catch(async () => {
            error(msg.channel, `I can't unban user ${args[0]}.`);
        });
	},
}