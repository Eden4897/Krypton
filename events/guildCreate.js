const Guild = require("../models/guild");
const { defaultGuild } = require("../models/guild");

module.exports = async (bot, guild) => {
    guild = new Guild(defaultGuild(guild));

    await guild.save()
    .catch(err => console.log(err));
}