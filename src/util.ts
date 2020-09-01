export const hewwwo = (texty_wexty: string) => {
    return texty_wexty
        .replace(/(\w)(\w*)lge/g, "$1$2lgie w$2lgie")
        .replace(/(\w)(\w*)uck/g, "$1$2lgie w$2lgie")
        .replace(/[r|l]/g, "w")
        .replace(/you/g, "uwu");
};

export const asyncify = (msg: string) =>
    `
    module.exports = async () => {
        ${msg}
    };
    `;

export const mainPath = () => __dirname + "/" + require.main?.filename;

// TODO: use string[] for command aliases
export const addDefaultCommands = (commands: Map<string, string>) => {
    commands.set("uwu", "uwu");
    commands.set("help", "help");
    commands.set("eval", "eval");
};

export type Config = {
    token: string;
    channels?: string[];
    prefix?: string;
    botOwner?: string;
    debug?: boolean;
    commands?: Map<string, string>;
};
