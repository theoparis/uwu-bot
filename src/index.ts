import Discord, {
    Channel,
    Message,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import readline from "readline";
import { hewwwo, Config, asyncify, mainPath, addDefaultCommands } from "./util";
import { NodeVM } from "vm2";

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

let commands: Map<string, string> = new Map();

if (config.commands) config.commands.forEach((c, k) => commands.set(k, c));

addDefaultCommands(commands);

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.TOKEN || config.token);

const prefix = process.env.PREFIX || config.prefix || "!!";
let channels = config.channels || [];
const messages: Message[] = [];

rl.on("line", (d) => {
    try {
        channels.forEach((currentChannel) => {
            const channel = client.channels.cache.find(
                (c: Channel) => c.id === currentChannel,
            );
            if (channel && channel.type === "text")
                (channel as TextChannel).send(d);
        });
    } catch {}
});

client.on("message", async (message: Message) => {
    if (message.author.id === client.user?.id) return;
    const regex = new RegExp(
        `(${prefix}?\\w+)\\s*((?:\\s*\\w*"*\\.*;*\`*[(]*[)]*)*)`,
        "g",
    );
    // regex.lastIndex = 0;
    const matches = message.content.matchAll(regex);
    // No matches
    if (matches === null) return;

    if (!channels[0]) channels[0] = message.channel.id;

    let result = "";
    let vm: NodeVM | undefined;
    let log = "";

    for (let match of matches) {
        match = match.slice(1);

        // for (let command of match) {
        const command = match[0].replace(prefix, "");
        const rawMessage = match[1];
        const args = message.content.replace(match[0], "").slice(1).split(" ");
        // const commandRegex = new RegExp(`(${prefix}?\\w+)`);
        // const rawMessage = command.replace(commandRegex, "");
        console.log(`cmd: ${command}, msg: ${rawMessage}`);
        if (command === commands.get("help")) {
            let msg = `Commands: \n`;
            commands.forEach((c) => {
                msg += `- ${c}\n`;
            });
            result += msg;
        } else if (command === commands.get("uwu")) {
            result += hewwwo(rawMessage);
        } else if (command === "purge" && args[0]) {
            if (message.channel.type == "text") {
                try {
                    const messageCount = parseInt(args[0]) + 1 || 0;
                    if (messageCount !== 0) {
                        const messages = await message.channel.messages.fetch({
                            limit: messageCount,
                        });

                        message.channel.bulkDelete(messages);

                        result += `Purged ${args[0]} messages`;
                    }
                } catch (e) {
                    result += "Purge error";
                    console.log(e);
                }
            }
        } else if (command === commands.get("eval")) {
            try {
                // Admin check to make sure user has perms to eval code with the bot object, otherwise don't include the bot object
                if (
                    message.member &&
                    message.member.id ===
                        (process.env.BOT_OWNER ||
                            config.botOwner ||
                            "140296096839630848")
                ) {
                    if (process.env.DEBUG === "true" || config.debug === true)
                        console.log("Admin executed eval!");
                    vm = new NodeVM({
                        require: {
                            external: true,
                        },
                        sandbox: {
                            _bot: client,
                            _message: message,
                            console: {
                                log: (message: string) =>
                                    (log += `${message}\n`),
                            },
                        },
                    });
                } else
                    vm = new NodeVM({
                        require: {
                            external: true,
                        },
                        sandbox: {
                            console: {
                                log: (message: string) =>
                                    (log += `${message}\n`),
                            },
                        },
                    });
                result += rawMessage;
            } catch (e) {
                result += e.toString();
            }
        }
    }

    if (result !== "") {
        if (vm) {
            try {
                result = await vm.run(
                    asyncify(
                        result
                            .replace(/(`|```)+.*(?:\s)/, "")
                            .replace(/```(\\s|\n)/, ""),
                    ),
                    mainPath(),
                )();
                result =
                    typeof result === "string"
                        ? result
                        : JSON.stringify(result);
                if (result && result.trim() === "")
                    result = "No response from code.";
                result += log;
            } catch (err) {
                result = `Error: \n${err.message}`;
            }
        }
        // Code block check
        if (!vm && result.includes("`")) return;
        const msg = await message.channel.send(result);
        messages.push(msg);
    }
});
