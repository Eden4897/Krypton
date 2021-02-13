import Guild, { defaultGuild } from '../models/guild';

export default async (bot, guild) => {
  guild = new Guild(defaultGuild(guild));

  await guild.save()
    .catch(err => console.log(err));
}