const mongoose = require("mongoose");
const guild = require("../models/guild");
const Guild = require("../models/guild");

module.exports = async (bot, guild) => {
    Guild.findOneAndDelete({
        guildID: guild.id
    }, (err, res) => {
        if(err) console.error(err);
    })
}