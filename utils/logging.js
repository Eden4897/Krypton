const { MessageEmbed } = require("discord.js");

module.exports.error = async (channel, content) => {
    const embed = new MessageEmbed()
    .setDescription(`<:KryptonCross:779318705498619946> ${content}`)
    .setColor("#FF3838");
    return await channel.send(embed);
}

module.exports.notif = async (channel, content) => {
    const embed = new MessageEmbed()
    .setDescription(`<:KryptonNotif:779611889860083733> ${content}`)
    .setColor("#3B88C3");
    return await channel.send(embed);
}

module.exports.success = async (channel, content) => {
    const embed = new MessageEmbed()
    .setDescription(`<:KryptonTick:779319144540536832> ${content}`)
    .setColor("#38E500");
    return await channel.send(embed);
}