const {error, success} = require("../utils/logging");

module.exports = {
    name: 'purge',
    description: 'Purges messages',
    admin: true,
    args: 1,
	async execute(bot, msg, args) {
        await msg.delete();
        // If there is a member pinged
        if(parseInt(args[1]) && msg.mentions.members.first()){
            if(parseInt(args[1] > 100)){
                return error(msg.channel, "I can only purge a maximum of 100 messages at a time.");
            }
            let found = 0;
            await msg.channel.messages.fetch()
            .then(messages => msg.channel.bulkDelete(messages.filter((m) => { if(m.author.id == msg.mentions.members.first().id && numDaysBetween(m.createdAt, new Date()) < 14) return ++found < parseInt(args[1]); })))
            if(found <= 0){
                await error(msg.channel, "I can't purge messages older than 14 days.");
            }
        }
        // If there is only a number
        else if(parseInt(args[0])) {
            if(parseInt(args[0]) > 100){
                return await error(msg.channel, "I can only purge a maximum of 100 messages at a time.");
            }
            await msg.channel.messages.fetch({ limit: parseInt(args[0]) })
            .then(messages => msg.channel.bulkDelete(messages.filter((m) => numDaysBetween(m.createdAt, new Date()) < 14)));
        }
        else{
            if(parseInt(args[1] > 100)){
                return error(msg.channel, "I can only purge a maximum of 100 messages at a time.");
            }
            let filter = null;
            let limit = Number.MAX_VALUE;
            switch(args[0]){
                case "startswith":
                    filter = (m) => m.content.startsWith(args[1]);
                break;
                case "endswith":
                    filter = (m) => m.content.endsWith(args[1]);
                break;
                case "attachments":
                    if(isNaN(args[1])) return msg.delete();
                    filter = (m) => m.attachments.size > 0;
                    limit = args[1];
                break;
                case "mentions":
                    if(isNaN(args[1])) return msg.delete();
                    filter = (m) => m.mentions.users.first() || m.mentions.roles.first() || m.mentions.everyone;
                    limit = args[1];
                break;
                case "embeds":
                    if(isNaN(args[1])) return msg.delete();
                    filter = (m) => m.embeds.length > 0;
                    limit = args[1];
                break;
                case "text":
                    if(isNaN(args[1])) return msg.delete();
                    filter = (m) => m.embeds.length <= 0 && m.attachments.size <= 0;
                    limit = args[1];
                break;
                case "human":
                    if(isNaN(args[1])) return msg.delete();
                    filter = (m) => !m.author.bot;
                    limit = args[1];
                break;
                case "bot":
                    if(isNaN(args[1])) return msg.delete();
                    filter = (m) => m.author.bot;
                    limit = args[1];
                break;
            }

            if(filter){
                let found = 0;
                
                await msg.channel.messages.fetch()
                .then(messages => msg.channel.bulkDelete(messages.filter((m) => {
                    if(filter(m) && numDaysBetween(m.createdAt, new Date()) < 14) return ++found < limit;   
                    return false;
                })))
                if(found <= 0){
                    await error(meg.channel.send("I can't purge messages older than 14 days."));
                }
            }
        }
	},
}

var numDaysBetween = function(d1, d2) {
    var diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
};