const { MessageEmbed } = require("discord.js");
const {error, success, notif} = require("../utils/logging");

module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: "{p}ping",
    example: "{p}ping",
    admin: false,
    args: 0,
	async execute(bot, msg, args, help) {
		const pinging = await notif(msg.channel, "🏓 Pinging...");

        const embed = new MessageEmbed()
        .setColor("#3B88C3")
        .setTitle("🏓 Pong!")
        .setDescription(`Bot Latency is **${Math.floor(pinging.createdTimestamp - msg.createdTimestamp)} ms** \nAPI Latency is **${Math.round(bot.ws.ping)} ms**`);

        pinging.delete();
        await msg.channel.send(embed);
	},
}