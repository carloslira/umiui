import fs from "node:fs";

import { transform } from "lightningcss";

const minify = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const css = await fs.promises.readFile(filePath, "utf8");

  try {
    const { code } = transform({
      filename: filePath,
      code: Buffer.from(css),
      minify: true,
    });

    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const modifiedCode =
      `/*! umiUI ${packageJson.version} - MIT License */ ` + code;

    await fs.promises.writeFile(filePath, modifiedCode);
  } catch (error) {
    throw new Error(`${filePath}:${error?.loc?.line}: ${error.message}`);
  }
};

export default minify;
