import { TextChannel, DMChannel, NewsChannel, MessageEmbed, Message, User } from 'discord.js';

export async function error (channel: TextChannel | DMChannel | NewsChannel | User, content: string): Promise<Message>{
  const embed = new MessageEmbed()
    .setDescription(`<:KryptonCross:779318705498619946> ${content}`)
    .setColor(`#FF3838`);
  return await channel.send(embed);
}

export async function notif (channel: TextChannel | DMChannel | NewsChannel | User, content: string): Promise<Message>{
  const embed = new MessageEmbed()
    .setDescription(`<:KryptonNotif:779611889860083733> ${content}`)
    .setColor(`#3B88C3`);
  return await channel.send(embed);
}

export async function success (channel: TextChannel | DMChannel | NewsChannel | User, content: string): Promise<Message>{
  const embed = new MessageEmbed()
    .setDescription(`<:KryptonTick:779319144540536832> ${content}`)
    .setColor(`#38E500`);
  return await channel.send(embed);
}