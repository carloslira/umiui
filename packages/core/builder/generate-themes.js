import fs from "node:fs/promises";
import path from "node:path";

import themeOrder from "./theme-order";
import getFileNames from "./get-file-names";

const readFileContent = async (filePath) => await fs.readFile(filePath, "utf8");

const readAllThemeCSS = async () => {
  // Get all file names in the ./theme folder with the .css extension
  const themeDirs = await getFileNames("./theme", ".css", false);

  // Read the content of each theme CSS file and store in an object
  const themeContents = {};

  await Promise.all(
    themeDirs.map(async (themeDir) => {
      const content = await readFileContent(
        path.join("./theme", `${themeDir}.css`)
      );
      themeContents[themeDir] = content;
    })
  );

  // Sort themes according to the specified order
  const sortedThemeContents = themeOrder
    .filter((theme) => themeDirs.includes(theme))
    .map((theme) => themeContents[theme]);

  return sortedThemeContents.join("\n");
};

const generateThemes = async (outputFile) => {
  try {
    // Read all theme CSS files
    const themeContent = await readAllThemeCSS();

    // Write the combined theme content to the output file
    await fs.writeFile(outputFile, themeContent);
  } catch (error) {
    throw new Error("Error generating themes:", error);
  }
};

export default generateThemes;
