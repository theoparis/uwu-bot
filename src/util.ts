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

export type Config = {
	token: string;
	channels?: string[];
	prefix?: string;
	botOwner?: string;
	debug?: boolean;
};
