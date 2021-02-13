import { Command, isMod } from '..';
import { error, success, notif } from '../utils/logging';
import { resolveMember } from '../utils/resolve';

export default {
  name: `mute`,
  description: `Mutes a user`,
  usage: `{p}mute [user] (reason)`,
  example: `{p}mute <@401376663541252096>\n{p}mute Eden Spamming too much\n{p}mute401376663541252096`,
  admin: true,
  args: [],
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
      )
        .then(async r => {
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
        )
        .catch();

      if (!role) 
      {
        return error(msg.channel, `I cannot create the role! Please make sure I have \`Manage Roles\` and \`Manage Channels\` permissions.`);
      }
    }

    const member = resolveMember(args[0], msg.guild);

    if (!member) 
    {
      return error(msg.channel, `I can't find user ${args[0]}.`);
    }

    if (member.roles.cache.some(r => r.id == role.id)) 
    {
      return notif(msg.channel, `<@${member.id}> was already muted.`)
    }

    if (await isMod(member)) 
    {
      return error(msg.channel, `<@${member.id}> is a mod; i cannot mute them.`)
    }

    let reason = msg.content.slice(args[0].length + 7);

    if (!reason) 
    {
      reason = `undefined`;
    }

    notif(member.user, `You have been muted in ${msg.guild.name} for: \`${reason}\`.`)
      .then(async dm => 
        {
          await member.roles.add(role)
            .then(async () => 
              {
                success(msg.channel, `User <@!${member.id}> was muted.`);
              }
            )
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
              }
            );
        }
      );
  },
} as Command;