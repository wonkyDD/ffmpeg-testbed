import fs from "node:fs";
import path from "node:path";
// import { log } from "@/src/util";
import { video } from "@/src/constants";

const clean = async() => {
    let t = [];
    let files = await fs.promises.readdir(".");
    t = [...files.filter(f => f.endsWith(".webm"))];
    files = await fs.promises.readdir("video");
    t = [...t, ...files.filter(f => f !== video && f.endsWith(".webm")).map(f => path.join("video", f))];
    await Promise.all(t.map(f => fs.promises.unlink(f)));
};

(async() => {
    // use yargs: https://github.com/yargs/yargs
    // if first  argument == --clean
    if (process.argv[2] === "--clean") await clean();
    else process.exit(1);    
})();
