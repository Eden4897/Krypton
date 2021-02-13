import { ArgumentType, Command } from "..";
import { resolveMember } from "../utils/resolve";

import { error, success, notif } from '../utils/logging';
import Guild, { IGuild } from '../models/guild';

export default {
  name: `clearwarn`,
  description: `Cleas all warnings for a user`,
  usage: `{p}clearwarn [user] (reason)`,
  example: `{p}clearwarn <@401376663541252096>
            {p}clearwarn Eden
            {p}clearwarn 401376663541252096`,
  admin: true,
  args: [ArgumentType.String],
  async execute(bot, msg, args, help) 
  {
    let member = resolveMember(args[0], msg.guild);

    if (!member) 
    {
      return error(msg.channel, `I can't find user ${args[0]}`);
    }

    const guild = await Guild.findOne(
      {
        guildID: msg.guild.id
      }
    ) as IGuild;

    if (!guild.warns.some(warn => warn.userID == member.id)) 
    {
      return error(msg.channel, `No warnings for ${member.user.tag} found.`);
    }

    const numWarns = guild.warns.filter(warn => warn.userID == member.id).length;

    await Guild.findOneAndUpdate(
      {
        guildID: msg.guild.id
      }, 
      {
        $pull: 
        {
          warns: 
          {
            userID: member.id
          }
        }
      }, (err, doc, res) => 
      {
        success(msg.channel, `${numWarns} warning(s) for ${member.user.tag} has been removed.`);
      }
    );
  },
} as Command