import { ArgumentType, Command } from '..';
import { error, success, notif } from '../utils/logging';
import { resolveMember } from '../utils/resolve';

export default {
  name: `unmute`,
  description: `Unmutes a user`,
  usage: `{p}unmute [user]`,
  example: `{p}unmute <@401376663541252096>
            {p}unmute Eden
            {p}unmute 401376663541252096`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) 
  {
    let role = await msg.guild.roles.cache.find(r => r.name == `Muted`);

    const member = resolveMember(args[0], msg.guild);

    if (!member) 
    {
      return error(msg.channel, `I can't find user ${args[0]}.`);
    }

    if (member.roles.cache.some(r => r.id == role.id)) 
    {
      member.roles.remove(role)
        .then(async () => 
          {
            await success(msg.channel, `<@${member.id}> has been unmuted.`);
          }
        )
        .catch(async () => 
          {
            await error(msg.channel, `I cannot unmute <@${member.id}>.`);
          }
        )
    } else 
    {
      await notif(msg.channel, `<@${member.id}> is not muted!`);
    }
  },
} as Command;