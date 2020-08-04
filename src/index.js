const Discord = require("discord.js");
const client = new Discord.Client();
const { hewwwo } = require("./uwuify");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

let config = {};
try {
    config = require("../config.json");
} catch {
    console.log("Failed to read config.json, using defaults.");
}

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.BOT_TOKEN || config.token);

const prefix = process.env.PREFIX || config.prefix;
let channels = config.channels || [];

rl.on("line", (d) => {
    try {
        channels.forEach((currentChannel) => {
            const channel = client.channels.cache.find(
                (c) => c.id === currentChannel,
            );
            if (channel) channel.send(d);
        });
    } catch {}
});

client.on("message", (message) => {
    // If message doesn't start with the prefix or was sent by a bot, exit early.
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = message.content.replace(
        new RegExp(`/(\\${prefix}\w*) .*/m`),
        "$&",
    );

    if (!channels[0]) channels[0] = message.channel.id;

    if (command === "uwu") {
        if (!args.length) {
            return message.channel.send(
                `You didn't provide a message to uwuify, ${message.author}!`,
            );
        }

        message.delete();
        message.channel.send(
            hewwwo(
                message.content.replace(new RegExp(`/\\${prefix}\w* /`, "")),
            ),
        );
    }
});
