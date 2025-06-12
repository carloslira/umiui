import fs from "node:fs";
import path from "node:path";

import minify from "./minify";

const minifyCssInDirectory = async (directories) => {
  await Promise.all(
    directories.map(async (dir) => {
      const directory = path.join(dir);
      const files = fs
        .readdirSync(directory)
        .filter((file) => path.extname(file).toLowerCase() === ".css")
        .map((file) => path.join(directory, file));

      await Promise.all(files.map(minify));
    })
  );
};

export default minifyCssInDirectory;
