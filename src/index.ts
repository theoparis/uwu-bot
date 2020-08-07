import Discord, { Message, TextChannel } from "discord.js";
import readline from "readline";
import { hewwwo, Config } from "./util";

const client = new Discord.Client();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

let config: Config = {
    token: "",
};
try {
    config = require("../config.json");
} catch {
    console.log("Failed to read config.json, using defaults.");
}

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.BOT_TOKEN || config.token);

const prefix = process.env.PREFIX || config.prefix || "!!";
let channels = config.channels || [];

rl.on("line", (d) => {
    try {
        channels.forEach((currentChannel) => {
            const channel = client.channels.cache.find(
                (c) => c.id === currentChannel,
            );
            if (channel && channel.type === "text")
                (channel as TextChannel).send(d);
        });
    } catch {}
});

client.on("message", (message: Message) => {
    const regex = new RegExp(
        `(?:${prefix}|!)${/(\w+)\s+((?:[^!]|(?:(?<!\s)!))*)/.source}`,
        "g",
    );
    const matches = message.content.match(regex);

    // No matches
    if (matches === null) return;

    if (!channels[0]) channels[0] = message.channel.id;

    let result = "";

    // Code block, don't uwuify
    if (matches.some((m: string) => m.includes("`"))) return;

    matches.forEach((m: string) => {
        const commandRegex = new RegExp(`(?:${prefix}|!)${/(\w+)\s+/.source}`);
        const commands = m.match(commandRegex)!.slice(1);
        commandRegex.lastIndex = 0;
        for (let command of commands) {
            const rawMessage = m.replace(commandRegex, "");
            console.log(`cmd: ${command}, msg: ${rawMessage}`);
            if (command === "uwu") result += hewwwo(rawMessage);
        }
    });
    if (result !== "") {
        message.delete();
        message.channel.send(result);
    }
});
