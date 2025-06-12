import fs from "node:fs/promises";
import path from "node:path";

const getDirectoriesWithTargetFile = async (directory, targetFile) => {
  const files = await fs.readdir(directory);
  const filteredDirs = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      try {
        await fs.access(path.join(filePath, targetFile));
        filteredDirs.push(file);
      } finally {
        // File doesn't exist, skip this directory
      }
    }
  }

  return filteredDirs;
};

export default getDirectoriesWithTargetFile;
