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

client.login(process.env.TOKEN || config.token);

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

client.on("message", async (message: Message) => {
    if (message.author.id === client.user?.id) return;
    const regex = new RegExp(
        `(${prefix}?\\w+)${/\s+((?:[\w|\s])*)/.source}`,
        "g",
    );
    // regex.lastIndex = 0;
    const matches = message.content.matchAll(regex);
    ``;
    // No matches
    if (matches === null) return;

    if (!channels[0]) channels[0] = message.channel.id;

    let result = "";

    for (let match of matches) {
        match = match.slice(1);
        console.log(JSON.stringify(match));

        // Code block, don't uwuify
        if (match.some((m: string) => m.includes("`"))) return;

        // for (let command of match) {
        const command = match[0].replace(prefix, "");
        const rawMessage = match[1];
        // const commandRegex = new RegExp(`(${prefix}?\\w+)`);
        // const rawMessage = command.replace(commandRegex, "");
        console.log(`cmd: ${command}`);
        if (command === "uwu") result += hewwwo(rawMessage);
        else result += `${command} ${rawMessage}`;
    }

    if (result !== "") {
        message.delete();
        const msg = await message.channel.send(result);
        if (message.author.bot) msg.delete();
    }
});
