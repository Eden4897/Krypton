import { error, success } from '../utils/logging';
import Guild from '../models/guild';
import { ArgumentType, Command } from '..';
import { resolveRole } from '../utils/resolve';

export default 
{
  name: `addmod`,
  description: `Adds a role as a mod`,
  usage: `{p}addmod [role]`,
  example: `{p}addmod @Mods
            {p}addmod 780068153937887303
            {p}addmod Moderators`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) 
  {
    const modRole = resolveRole(args[0], msg.guild);

    if (!modRole) {
      return error(msg.channel, `I can't find role ${args[0]}.`);
    }

    await Guild.findOneAndUpdate(
      {
        guildID: msg.guild.id
      }, 
      {
        $addToSet: 
        {
          mods: modRole.id
        }
      }
    );

    success(msg.channel, `Role **${modRole.name}** had been added to the list of mods.`);
  },
} as Command