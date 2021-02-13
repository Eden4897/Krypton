import { DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { type } from 'os';
import { ArgumentType, Command } from '..';
import { error, success } from '../utils/logging';

export default{
  name: `purge`,
  description: `Purges messages`,
  usage: `{p}purge [number]
          {p}purge [user] [number]
          {p}purge startswith [prefix]
          {p}purge endswith [postfix]
          {p}purge attatchments [number]
          {p}purge mentions [number]
          {p}purge embeds [number]
          {p}purge text [number]
          {p}purge human [number]
          {p}purge bot [number]`,
  example: `{p}purge 50
            {p}purge Eden 80
            {p}purge 401376663541252096 78
            {p}purge startswith hello
            {p}purge endswith .
            {p}purge attatchments 5
            {p}purge mentions 15
            {p}purge embeds 30
            {p}purge text 40
            {p}purge human 100
            {p}purge bot 70`,
  admin: true,
  args: [ArgumentType.PositiveInteger],
  async execute(bot, msg, args, help) 
  {
    if(typeof msg.channel == typeof DMChannel)
    {
      return error(msg.channel, `I cannot purge messages in a DM channel.`);
    }
    // If there is a member pinged
    if (parseInt(args[1]) && msg.mentions.members.first()) 
    {
      if (parseInt(args[1]) > 100) 
      {
        return error(msg.channel, `I can only purge a maximum of 100 messages at a time.`);
      }
      let found = 0;
      await msg.channel.messages.fetch()
        .then(messages => 
          (msg.channel as TextChannel | NewsChannel).bulkDelete(
            messages.filter((m) => 
              {
                if (m.author.id == msg.mentions.members.first().id && numDaysBetween(m.createdAt, new Date()) < 14) 
                  return ++found < parseInt(args[1]); 
              }
            )
          )
        )
      if (found <= 0) 
      {
        await error(msg.channel, `I can't purge messages older than 14 days.`);
      }
    }
    // If there is only a number
    else if (parseInt(args[0])) 
    {
      if (parseInt(args[0]) > 100) 
      {
        return await error(msg.channel, `I can only purge a maximum of 100 messages at a time.`);
      }
      await msg.channel.messages.fetch({ limit: parseInt(args[0]) })
        .then(messages => 
          (msg.channel as TextChannel | NewsChannel)
          .bulkDelete(messages.filter((m) =>
            numDaysBetween(m.createdAt, new Date()) < 14)
          )
        );
    }
    else 
    {
      if (parseInt(args[1]) > 100) 
      {
        return error(msg.channel, `I can only purge a maximum of 100 messages at a time.`);
      }
      let filter = null;
      let limit = Number.MAX_VALUE;
      switch (args[0]) {
        case `startswith`:
          filter = (m) => m.content.startsWith(args[1]);
          break;
        case `endswith`:
          filter = (m) => m.content.endsWith(args[1]);
          break;
        case `attachments`:
          filter = (m) => m.attachments.size > 0;
          limit = +args[1];
          break;
        case `mentions`:
          filter = (m) => m.mentions.users.first() || m.mentions.roles.first() || m.mentions.everyone;
          limit = +args[1];
          break;
        case `embeds`:
          filter = (m) => m.embeds.length > 0;
          limit = +args[1];
          break;
        case `text`:
          filter = (m) => m.embeds.length <= 0 && m.attachments.size <= 0;
          limit = +args[1];
          break;
        case `human`:
          filter = (m) => !m.author.bot;
          limit = +args[1];
          break;
        case `bot`:
          filter = (m) => m.author.bot;
          limit = +args[1];
          break;
        case `defalt`:
          return msg.channel.send(help);
      }

      if (filter) {
        let found = 0;

        await msg.channel.messages.fetch()
          .then(messages => 
            (msg.channel as TextChannel | NewsChannel)
            .bulkDelete(
              messages.filter((m) => 
                {
                  if (filter(m) && numDaysBetween(m.createdAt, new Date()) < 14) return ++found < limit;
                  return false;
                }
              )
            )
          )
        if (found <= 0) 
        {
          await error(msg.channel,`I can't purge messages older than 14 days.`);
        }
      }
    }
  },
} as Command;

function numDaysBetween (d1, d2) 
{
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return diff / (1000 * 60 * 60 * 24);
};