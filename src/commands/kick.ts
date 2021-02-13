import { ArgumentType, Command } from "..";
import { resolveMember } from "../utils/resolve";

const { error, success, notif } = require(`../utils/logging`);

export default{
  name: `kick`,
  description: `Kicks a user`,
  usage: `{p}kick [user] (reason)`,
  example: `{p}kick <@401376663541252096>
            {p}kick Eden Bye!
            {p}kick 401376663541252096`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) 
  {
    const member = resolveMember(args[0], msg.guild);

    if (!member) 
    {
      return error(msg.channel, `I can't find user ${args[0]}.`);
    }

    let reason = msg.content.slice(args[0].length + 7);

    if (!reason) 
    {
      reason = `undefined`;
    }

    notif(member.user, `You have been kicked from ${msg.guild.name} for: \`${reason}\`. You can rejoin if someone invites you.`)
      .then(async dm => 
        {
          await member.kick(reason)
            .then(async () => 
              {
                success(msg.channel, `User <@!${member.id}> was kicked.`);
              }
            )
            .catch(async () => 
              {
                error(msg.channel, `I can't kick user <@${member.id}>.`);
                if (dm) dm.delete();
              }
            );
        }
      )
      .catch(async () => 
        {
          await member.kick(reason)
            .then(async () => 
              {
                success(msg.channel, `User <@!${member.id}> was kicked. Their DMs were closed.`);
              }
            )
            .catch(async () => 
              {
                error(msg.channel, `I can't kick user <@${member.id}>.`);
              }
            );
        }
      );
  },
} as Command;