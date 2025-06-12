import { readFileSync, writeFileSync } from "fs";

const readPackageVersion = (packageJsonPath) => {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  return packageJson.version;
};

const updateIndexJsVersion = (indexJsPath, version) => {
  let indexJsContent = readFileSync(indexJsPath, "utf-8");
  indexJsContent = indexJsContent.replace(
    /const version = ".*"/,
    `const version = "${version}"`
  );

  writeFileSync(indexJsPath, indexJsContent, "utf-8");
};

const updateVersion = () => {
  const packageJsonPath = "packages/core/package.json";
  const indexJsPath = "packages/core/index.js";

  try {
    const version = readPackageVersion(packageJsonPath);
    updateIndexJsVersion(indexJsPath, version);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export default updateVersion;
