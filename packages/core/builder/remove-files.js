import fs from "node:fs/promises";
import path from "node:path";

const removeFiles = async (items = []) => {
  const removePromises = items.map(async (item) => {
    const itemPath = path.resolve(item);

    try {
      const stats = await fs.lstat(itemPath);
      if (stats.isDirectory()) {
        await fs.rmdir(itemPath, { recursive: true });
      } else {
        await fs.unlink(itemPath);
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  });

  await Promise.all(removePromises);
};

export default removeFiles;
