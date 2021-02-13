import { error, success, notif } from '../utils/logging';
import Guild, { IGuild } from '../models/guild';
import { ArgumentType, Command } from '..';

export default {
  name: `delwarn`,
  description: `Warns a user`,
  usage: `{p}delwarn [warning ID]`,
  example: `{p}delwarn 123`,
  admin: true,
  args: [ArgumentType.NonZeroPositiveInteger],
  async execute(bot, msg, args, help) 
  {
    const guild = await Guild.findOne(
      {
        guildID: msg.guild.id
      }
    ) as IGuild;

    if (!guild.warns.some(warn => warn.id == +args[0])) 
    {
      return error(msg.channel, `No warning with ID ${args[0]} found.`);
    }

    await Guild.findOneAndUpdate(
      {
        guildID: msg.guild.id
      }, 
      {
        $pull: 
        {
          warns: 
          {
            id: parseInt(args[0])
          }
        }
      }
    );

    success(msg.channel, `Warning ${args[0]} has been removed.`);
  },
} as Command;