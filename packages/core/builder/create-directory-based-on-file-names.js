import fs from "fs/promises";
import path from "path";

const createDirectoryBasedOnFileNames = async (
  fileName,
  fileExtension,
  distDir
) => {
  const componentName = path.basename(fileName, fileExtension);
  const componentDir = path.join(distDir, componentName);

  await fs.mkdir(componentDir, { recursive: true });

  return componentDir;
};

export default createDirectoryBasedOnFileNames;
