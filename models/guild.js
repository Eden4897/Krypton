const mongoose = require("mongoose");

const warningSchema = mongoose.Schema({
    id: Number,
    userID: String,
    modID: String,
    reason: String
},{
    timestamps: true
})

const guildSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    prefix: String,
    mods: [String],
    warns: [warningSchema],
    lastWarnID: Number
},{
    timestamps: true
})

module.exports = mongoose.model("Guild", guildSchema, "guilds");

module.exports.defaultGuild = guild => {
    return{
        guildID: guild.id,
        guildName: guild.name,
        prefix: "!",
        mods: [],
        warns: [],
        lastWarnID: 0
    }
}