const { Command } = require("discord.js-commando");
const moment = require("moment");
require("moment-duration-format");

const formatUptime = time => moment.duration(time).format("D [days], H [hrs], m [mins], s [secs]");
module.exports = class ShardsCommand extends Command {

    constructor(client) {
        super(client, {
            name: "shards",
            group: "core",
            memberName: "shards",
            description: "View Shard details",
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }
    async run(msg) {
        if (msg.guild && !msg.channel.permissionsFor(msg.guild.me).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) return;
        const evalstr = `[this.shard.id, this.guilds.size, this.channels.size, this.users.size, (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2), this.voiceConnections.size, this.uptime]`;
        const result = await this.client.shard.broadcastEval(evalstr);
        return msg.say(result.map(r => `${r[0]} : G ${r[1]}, C ${r[2]}, U ${r[3]}, M ${r[4]}, VC ${r[5]}, UP: ${formatUptime(r[6])}`).join("\n"), { code: "prolog" });
    }

};
