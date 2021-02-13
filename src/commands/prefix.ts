import { error, success } from '../utils/logging';
import Guild from '../models/guild';
import { ArgumentType, Command } from '..';

export default {
  name: `prefix`,
  description: `Changes the prefix of the server`,
  usage: `{p}prefix [New Prefix]`,
  example: `{p}prefix ?\n{p}prefix krypton`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) {
    await Guild.findOneAndUpdate({
      guildID: msg.guild.id
    }, {
      prefix: args[0]
    });

    success(msg.channel, `This server's prefix has been updated to \`${args[0]}\``);
  },
} as Command;