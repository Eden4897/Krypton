import { Guild } from 'discord.js';
import { Schema, model, Document } from 'mongoose';

const warningSchema: Schema = new Schema({
  id: Number,
  userID: String,
  modID: String,
  reason: String
}, {
  timestamps: true
});

const guildSchema: Schema = new Schema({
  guildID: { type: String, required: true, unique: true},
  guildName: { type: String, required: true },
  prefix: { type: String, required: true },
  mods: { type: [String], required: true },
  warns: { type: [warningSchema], required: true },
  lastWarnID: { type: Number, required: true },
});

export default model(`Guild`, guildSchema, `guilds`);

export interface IWarning extends Document{
  id: number,
  userID: string,
  modID: string,
  reason: string,
  createdAt: string
};

export interface IGuild extends Document{
  guildID: string,
  guildName: string,
  prefix: string,
  mods: Array<string>,
  warns: Array<IWarning>,
  lastWarnID: number,
};

export function defaultGuild(guild: Guild): object{
  return {
    guildID: guild.id,
    guildName: guild.name,
    prefix: `!`,
    mods: [],
    warns: [],
    lastWarnID: 0
  };
}