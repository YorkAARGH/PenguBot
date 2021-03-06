const { Command } = require("discord.js-commando");

module.exports = class ResumeSongCommand extends Command {

    constructor(client) {
        super(client, {
            name: "resume",
            group: "music",
            memberName: "resume",
            description: "Resumes the currently playing song.",
            details: "Only moderators may use this command.",
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author) || msg.member.hasPermission("ADMINISTRATOR") || this.client.functions.isDJ(msg);
    }

    async run(msg) {
        if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) return;
        if (!msg.member.voiceChannel) return msg.channel.send("You are not in a voice channel!");
        const queue = this.queue.get(msg.guild.id);
        if (!queue) return msg.reply(`❌ There is currently no music playing.`);
        if (queue.playing) return msg.reply("❌ The song isn't paused."); // eslint-disable-line max-len
        queue.dispatcher.resume();
        queue.playing = true;
        return msg.reply("✅ Resumed the paused music.");
    }

    get queue() {
        if (!this._queue) this._queue = this.client.registry.resolveCommand("music:play").queue;
        return this._queue;
    }

};
