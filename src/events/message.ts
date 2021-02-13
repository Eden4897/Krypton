import Guild, { IGuild } from '../models/guild';
import { defaultGuild } from '../models/guild';
import { error, notif } from '../utils/logging';
import { Client, Message, MessageEmbed } from 'discord.js';
import { ArgumentType, Command, commands, isMod, testArgument } from '..';

export default async (bot: Client, msg: Message) =>
{
  if (msg.author.bot) return;

  const settings = await Guild.findOne(
    {
      guildID: msg.guild.id
    }, (err, guild) => 
    {
      if (err) console.error(err);

      if (!guild) 
      {
        const newGuild = new Guild(defaultGuild(msg.guild)) as IGuild;

        newGuild.save()
          .catch(err => console.error(err));

        notif(msg.channel, `This server was not in our database! We have just added it.`);
      }
    }
  ) as IGuild;

  if (!settings) return;

  const PREFIX = settings.prefix;

  let args: Array<string> = msg.content.substring(PREFIX.length).match(/\\?.|^$/g).reduce((p: any, c) => 
  {
    if(c === '"')
    {
      p.quote ^= 1;
    }else if(!p.quote && c === ' ')
    {
      p.a.push('');
    }else
    {
      p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
    }
    return p;
  }, {a: ['']}).a
  let message = msg.content.substring(0);

  if (message.substring(0, PREFIX.length) == PREFIX) 
  {
    if (commands.has(args[0])) 
    {
      try 
      {
        if (commands.get(args[0]).admin && !await isMod(msg.member)) 
        {
          return error(msg.channel, `Access denied.`);
        }
        const command: Command = commands.get(args[0]);

        const embed = new MessageEmbed()
          .setTitle(`Command: ${PREFIX}${args[0]}`)
          .setDescription(
            `**Description: **`
            + command.description.replace(/{p}/g, PREFIX).replace(/(?<=\n) +/g, '')
            + `\n`
    
            + `**Usage: **`
            + command.usage.includes(`\n`) ? `\n` : ``
            + command.usage.replace(/{p}/g, PREFIX).replace(/(?<=\n) +/g, '')
            + `\n`
    
            + `**Examples: **`
            + command.example.includes(`\n`) ? `n` : ``
            + command.example.replace(/{p}/g, PREFIX).replace(/(?<=\n) +/g, '')
          )

        if (command.args.some((argTypes, index) => 
              {
                if(typeof argTypes == typeof ArgumentType){
                  argTypes = [argTypes as ArgumentType];
                }
                return (argTypes as Array<ArgumentType>).some(argType => testArgument(argType, args[index]));
              }
            )
          ) 
        {
          return msg.channel.send(embed);
        }
        await commands.get(args[0]).execute(bot, msg, args.slice(1), embed);

      } catch (err) 
      {
        console.error(err);
        error(msg.channel, `There was an error trying to execute the ${args[0]} command! Please contact the admins.`).catch(()=>{});
      }
    }
  }
};