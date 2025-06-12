import fs from "node:fs/promises";

import cssToJs from "./css-to-js";
import getFileNames from "./get-file-names";
import createPluginFiles from "./create-plugin-files";
import createDirectoryBasedOnFileNames from "./create-directory-based-on-file-names";

const generatePlugins = async ({ type, srcDir, distDir, exclude = [] }) => {
  await fs.mkdir(distDir, { recursive: true });
  const cssFiles = await getFileNames(srcDir, ".css");
  const filteredCssFiles = cssFiles.filter((file) => !exclude.includes(file));

  await Promise.all(
    filteredCssFiles.map(async (cssFile) => {
      const [jsContent, componentDir] = await Promise.all([
        cssToJs(`${srcDir}/${cssFile}.css`),
        createDirectoryBasedOnFileNames(cssFile, ".css", distDir),
      ]);

      await createPluginFiles(type, componentDir, jsContent, cssFile);
    })
  );
};

export default generatePlugins;
