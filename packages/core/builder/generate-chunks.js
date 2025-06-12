import fs from "node:fs/promises";

import themeOrder from "./theme-order";
import getFileNames from "./get-file-names";

const generateChunks = async (filename) => {
  try {
    let content = "";

    const themes = await getFileNames("./theme", ".css", false);
    const allowedThemes = ["light", "dark"];
    themeOrder.forEach((theme) => {
      if (themes.includes(theme) && allowedThemes.includes(theme)) {
        content += `@import url(theme/${theme}.css);\n`;
      }
    });

    const baseFiles = await getFileNames("./base", ".css", false);
    baseFiles.forEach((filePath) => {
      content += `@import url(base/${filePath}.css);\n`;
    });

    const componentFiles = await getFileNames("./components", ".css", false);
    componentFiles.forEach((filePath) => {
      content += `@import url(components/${filePath}.css);\n`;
    });

    const utilityFiles = await getFileNames("./utilities", ".css", false);
    utilityFiles.forEach((filePath) => {
      content += `@import url(utilities/${filePath}.css);\n`;
    });

    // Load color files with specific ordering
    const colorFiles = await getFileNames("./colors", ".css", false);
    colorFiles.forEach((filePath) => {
      content += `@import url(colors/${filePath}.css);\n`;
    });

    // Write to file
    await fs.writeFile(`./${filename}`, content, "utf8");
  } catch (error) {
    throw new Error(`Failed to generate full CSS: ${error.message}`);
  }
};

export default generateChunks;
