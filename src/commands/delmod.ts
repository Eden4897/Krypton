import { error, success } from '../utils/logging';
import Guild from '../models/guild';
import { ArgumentType, Command } from '..';
import { resolveRole } from '../utils/resolve';

export default {
  name: `delmod`,
  description: `Removes a role as a mod`,
  usage: `{p}delmod [role]`,
  example: `{p}delmod @Mods
            {p}delmod 780068153937887303
            {p}delmod Moderators`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) 
  {
    const mod = resolveRole(args[0], msg.guild);

    if (!mod) 
    {
      return error(msg.channel, `I can't find role ${args[0]}.`);
    }

    await Guild.findOneAndUpdate(
      {
        guildID: msg.guild.id
      }, 
      {
        $pull: 
        {
          mods: mod.id
        }
      }
    );

    success(msg.channel, `Role ${args[0]} had been removed from the list of mods.`);
  },
} as Command;