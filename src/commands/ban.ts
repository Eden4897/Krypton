import { ArgumentType, Command } from '..';
import { error, success, notif } from '../utils/logging';
import { resolveMember } from '../utils/resolve';

export default 
{
  name: `ban`,
  description: `Bans a user`,
  usage: `{p}ban [user] (reason)`,
  example: `{p}ban <@401376663541252096>
            {p}ban Eden Bye!
            {p}ban 401376663541252096`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) 
  {
    const member = resolveMember(args[0], msg.guild);

    if (!member) 
    {
      return error(msg.channel, `I can't find user ${args[0]}`);
    }

    let reason = msg.content.slice(args[0].length + 6);

    if (!reason) 
    {
      reason = `undefined`;
    }

    notif(member.user, `You have been banned from ${msg.guild.name} for: \`${reason}\`.`)
      .then(async dm => 
          {
          await member.ban({ days: 7, reason: reason })
            .then(async () => 
              {
                success(msg.channel, `User <@!${member.id}> was banned.`);
              }
            )
            .catch(async () => 
              {
                error(msg.channel, `I can't ban user <@${member.id}>.`);
                if (dm) dm.delete();
              }
            );
        }
      )
      .catch(async () => 
        {
          await member.ban({ days: 7, reason: reason })
            .then(async () => 
              {
                success(msg.channel, `User <@!${member.id}> was banned. Their DMs were closed.`);
              }
            )
            .catch(async () => 
              {
                error(msg.channel, `I can't ban user <@${member.id}>.`);
              }
            );
        }
      );
  },
} as Command;