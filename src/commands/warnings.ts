import { error, success, notif } from '../utils/logging';
import Guild, { IGuild } from '../models/guild';
import { MessageEmbed } from 'discord.js';
import { ArgumentType, Command } from '..';
import { resolveMember } from '../utils/resolve';

export default {
  name: `warnings`,
  description: `List all warnings of a user`,
  usage: `{p}warnings [user]`,
  example: `{p}warnings <@401376663541252096>\n{p}warnings Eden\n{p}warnings 401376663541252096`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) {
    const member = resolveMember(args[0], msg.guild);

    if (!member) {
      return error(msg.channel, `I can't find user ${args[0]}.`);
    }

    const guildSettings = await Guild.findOne({
      guildID: msg.guild.id
    }) as IGuild;

    const warnings = guildSettings.warns.filter(warning => warning.userID == member.id);

    if (warnings.length <= 0) {
      return notif(msg.channel, `There are no warnings for <@${member.id}>.`);
    }

    let embed = new MessageEmbed()
      .setAuthor(`${warnings.length} warnings(s) for ${member.user.tag}.`, member.user.displayAvatarURL());

    warnings.forEach(warning => {
      const modUser = msg.guild.members.cache.get(warning.modID).user;
      embed.addField(`ID: ${warning.id} | Mod: ${modUser.tag}`, `${warning.reason} - ${warning.createdAt.toString().substring(4, 15)}`);
      console.log(`${new Date(warning.createdAt)}`);
    });

    msg.channel.send(embed);
  },
} as Command;