import * as path from "path";

/** @type {import('vite').UserConfig} */
export default {
    resolve: {
        alias: [{ find: "#", replacement: path.resolve(__dirname, "assets") }],
    },
};
