const Discord = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Ping!',
    admin: false,
    args: 0,
	async execute(bot, msg, args) {
		const pinging = await msg.channel.send('🏓 Pinging...');

        const embed = new Discord.MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle('🏓 Pong!')
        .setDescription(`Bot Latency is **${Math.floor(pinging.createdTimestamp - msg.createdTimestamp)} ms** \nAPI Latency is **${Math.round(bot.ws.ping)} ms**`);

        await msg.channel.send(embed);
	},
}