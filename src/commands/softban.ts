import { ArgumentType, Command } from '..';
import { error, success, notif } from '../utils/logging';
import { resolveMember } from '../utils/resolve';

export default {
  name: `softban`,
  description: `Softbans a user`,
  usage: `{p}softban [user] (reason)`,
  example: `{p}softban <@401376663541252096>
            {p}softban Eden Bye!
            {p}softban 401376663541252096`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) {
    const member = resolveMember(args[0], msg.guild);

    if (!member) 
    {
      return error(msg.channel, `I can't find user ${args[0]}`);
    }

    let reason = msg.content.slice(args[0].length + 10);

    if (!reason) 
    {
      reason = `undefined`;
    }

    notif(member.user, `You have been softbanned from ${msg.guild.name} for: \`${reason}\`. You can rejoin if someone invites you.`)
      .then(async dm => 
        {
        await member.ban({ days: 7, reason: reason })
          .then(async () => 
            {
              await msg.guild.members.unban(member.id);
              success(msg.channel, `User <@!${member.id}> was softbanned.`);
            }
          )
          .catch(async () => 
            {
              error(msg.channel, `I can't softban user <@${member.id}>.`);
              if (dm) dm.delete();
            }
          );
      })
      .catch(async () => 
        {
          await member.ban({ days: 7, reason: reason })
            .then(async () => 
              {
                await msg.guild.members.unban(member.id);
                success(msg.channel, `User <@!${member.id}> was softbanned. Their DMs were closed.`);
              }
            )
            .catch(async () => 
              {
                error(msg.channel, `I can't softban user <@${member.id}>.`);
              }
            );
        }
      );
  },
} as Command;