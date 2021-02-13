import Guild from '../models/guild';

export default async (bot, guild) => {
  Guild.findOneAndDelete({
    guildID: guild.id
  }, (err, res) => {
    if (err) console.error(err);
  })
}