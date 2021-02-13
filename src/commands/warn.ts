import { error, success, notif } from '../utils/logging';
import Guild, { IGuild } from '../models/guild';
import { ArgumentType, Command } from '..';
import { resolveMember } from '../utils/resolve';

export default {
  name: `warn`,
  description: `Warns a user`,
  usage: `{p}warn [user] [reason]`,
  example: `{p}warn <@401376663541252096> Disrespecful
            {p}warn Eden No swearing
            {p}warn 401376663541252096 Posting advertisements`,
  admin: true,
  args: [ArgumentType.String, ArgumentType.String],
  async execute(bot, msg, args, help) 
  {
    const member = resolveMember(args[0], msg.guild);

    if (!member) 
    {
      return error(msg.channel, `I can't find user ${args[0]}.`);
    }

    const reason = args.slice(1).reduce((a, b) => a + b, ``) || `undefined`;

    const settings = await Guild.findOne(
      {
        guildID: msg.guild.id
      }
    ) as IGuild;

    await settings.updateOne(
      {
        $push: 
        {
          warns: 
          {
            id: settings.lastWarnID + 1,
            userID: member.id,
            modID: msg.member.id,
            reason: reason
          }
        },
        lastWarnID: settings.lastWarnID + 1
      }
    );

    notif(member.user, `You have been warned in ${msg.guild.name} for: **${reason}**.`)
      .then(() => 
        {
          success(msg.channel, `${member.user.tag} has been warned. ID: ${settings.lastWarnID + 1}`);
        }
      )
      .catch(() => 
        {
          success(msg.channel, `${member.user.tag} has been warned. Their DMs were closed. ID: ${settings.lastWarnID + 1}`);
        }
      );
  },
} as Command;