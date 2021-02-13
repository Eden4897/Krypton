import { ArgumentType, Command, isMod } from '..';
import { error, success, notif } from '../utils/logging';
import { resolveMember } from '../utils/resolve';

export default {
  name: `tempmute`,
  description: `Temporarily mutes a user`,
  usage: `{p}tempmute [user] [time] (reason)`,
  example: `{p}tempmute <@401376663541252096> 20d Spamming in general
            {p}tempmute Eden 20s
            {p}tempmute 401376663541252096 90m
            {p}tempmute Eden 8h Discord invites in general`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) {
    let role = await msg.guild.roles.cache.find(r => r.name == `Muted`);

    if (!role) {
      await msg.guild.roles.create(
        {
          data: 
          {
            name: `Muted`,
            color: `#546E7A`,
            hoist: false,
            mentionable: false
          }
        }
      ).then(async r => 
        {
          msg.guild.channels.cache.forEach(channel => 
            {
              channel.createOverwrite(r, 
                {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                CONNECT: false
                }
              )
            }
          );

          role = r;
        }
      ).catch();

      if (!role) 
      {
        return error(msg.channel, `I cannot create the role! Please make sure I have \`Manage Roles\` and \`Manage Channels\` permissions.`);
      }
    }

    const member = resolveMember(args[0], msg.guild);

    if (!member) {
      return error(msg.channel, `I can't find user ${args[0]}.`);
    }

    if (member.roles.cache.some(r => r.id == role.id)) {
      return notif(msg.channel, `<@${member.id}> was already muted.`)
    }

    if (await isMod(member)) {
      return error(msg.channel, `<@${member.id}> is a mod; i cannot mute them.`)
    }

    let reason = args.slice(2).reduce((a, b) => a + b, ``) || `undefined`;

    let duration = 0;

    const durationText = args[1].substring(0, args[1].length - 1);
    const durationUnit = args[1].substring(args[1].length - 1, args[1].length);

    if (!parseInt(durationText)) return msg.channel.send(help);
    if (parseInt(durationText) < 0) return msg.channel.send(help);

    switch (durationUnit) {
      case `s`:
        duration = parseInt(durationText) * 1000;
        break;
      case `m`:
        duration = parseInt(durationText) * 60 * 1000;
        break;
      case `h`:
        duration = parseInt(durationText) * 60 * 60 * 1000;
        break;
      case `d`:
        duration = parseInt(durationText) * 24 * 60 * 60 * 1000;
        break;
      default:
        return msg.delete();
    }

    notif(member.user, `You have been muted in ${msg.guild.name} for: \`${reason}\`.`)
      .then(async dm => 
        {
          await member.roles.add(role)
            .then(async () => 
            {
              success(msg.channel, `User <@!${member.id}> was muted.`);

              setTimeout(() => 
                {
                  member.roles.remove(role).catch();
                },
                duration
              );
            })
            .catch(async () => 
              {
                error(msg.channel, `I can't mute user <@${member.id}>.`);
                if (dm) dm.delete();
              }
            );
        }
      )
      .catch(async () => 
        {
          await member.roles.add(role)
            .then(async () => 
              {
                success(msg.channel, `User <@!${member.id}> was muted. Their DMs were closed.`);

                setTimeout(() => 
                  {
                    member.roles.remove(role).catch();
                  }, 
                  duration
                );
              }
            );
        }
      );
  },
} as Command;