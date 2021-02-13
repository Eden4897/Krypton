import { MessageEmbed } from 'discord.js';
import { error, success } from '../utils/logging';
import Guild, { IGuild } from '../models/guild';
import { Command } from '..';

export default {
  name: `listmods`,
  description: `List all mods`,
  usage: `{p}listmods`,
  example: `{p}listmods`,
  admin: true,
  args: [],
  async execute(bot, msg, args, help) 
  {
    const settings = await Guild.findOne(
      {
        guildID: msg.guild.id
      }
    ) as IGuild;

    const mods = settings.mods;
    const managers = msg.guild.roles.cache.filter(role => role.permissions.has(`MANAGE_GUILD`));

    if (!mods) 
    {
      return error(msg.channel, `There are currently no mod roles in this server.`);
    }
    else 
    {
      let rolestring = ``;
      managers.forEach(manager => 
        {
          if (mods.includes(manager.id)) return;
          rolestring += `<@&${manager.id}>\n`;
        }
      );
      mods.forEach(mod => 
        {
          rolestring += `<@&${mod}>\n`;
        }
      );

      const embed = new MessageEmbed()
        .setTitle(`Mod roles`)
        .setDescription(rolestring)
        .setColor(`#3B88C3`);

      await msg.channel.send(embed);
    }
  },
} as Command;