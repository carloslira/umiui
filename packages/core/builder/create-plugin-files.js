import fs from "node:fs/promises";
import path from "node:path";

const createPluginFiles = async (type, componentDir, jsContent, fileName) => {
  const types = {
    base: "addBase",
    component: "addComponents",
    utility: "addUtilities",
  };

  // create object.js
  const objectJsPath = path.join(componentDir, "object.js");
  await fs.writeFile(objectJsPath, `export default ${jsContent};`);

  // create index.js
  const indexJsPath = path.join(componentDir, "index.js");
  const indexJsContent = `
    import ${fileName} from './object.js';
    import addPrefix from '../../builder/add-prefix.js';

    export default ({ ${types[type]}, prefix = '' }) => {
      const prefixed${fileName} = addPrefix(${fileName}, prefix);
      ${types[type]}({ ...prefixed${fileName} });
    };
  `;

  await fs.writeFile(indexJsPath, indexJsContent);
};

export default createPluginFiles;
