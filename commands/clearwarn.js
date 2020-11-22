const {error, success, notif} = require("../utils/logging");
const Guild = require("../models/guild");

module.exports = {
    name: 'clearwarn',
    description: 'Cleas all warnings for a user',
    usage: "{p}clearwarn [user] (reason)",
    example: "{p}clearwarn <@401376663541252096>\n{p}clearwarn Eden\n{p}clearwarn 401376663541252096",
    admin: true,
    args: 1,
	async execute(bot, msg, args, help) {
        let member;
        if(msg.mentions.members.first()){
            // Find member by mentioning
            member = msg.mentions.members.first();
        }

        if(!member){
            // Find member by name
            member = msg.guild.members.cache.find(member => member.user.username == args[0]);
        }

        if(!member){
            // Find member by ID
            member = msg.guild.members.cache.get(args[0]);
        }

        if(!member){
            return error(msg.channel, `I can't find user ${args[0]}`);
        }
        
        const guild = await Guild.findOne({
            guildID: msg.guild.id
        });

        if(!guild.warns.some(warn => warn.userID == member.id)){
            return error(msg.channel, `No warnings for ${member.user.tag} found.`);
        }

        const numWarns = guild.warns.filter(warn => warn.userID == member.id).length;

        await Guild.findOneAndUpdate({
            guildID: msg.guild.id
        }, {
            $pull: {
                warns: {
                    userID: member.id
                }
            }
        },(err, doc, res)=>{
            success(msg.channel, `${numWarns} warning(s) for ${member.user.tag} has been removed.`);
        });
        
	},
}