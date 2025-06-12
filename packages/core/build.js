import report from "./builder/report";
import minify from "./builder/minify";
import packCss from "./builder/pack-css";
import copyFile from "./builder/copy-file";
import removeFiles from "./builder/remove-files";
import extractClasses from "./builder/extract-classes";
import generateThemes from "./builder/generate-themes";
import generateChunks from "./builder/generate-chunks";
import generateImports from "./builder/generate-imports";
import generatePlugins from "./builder/generate-plugins";
import generateRawStyles from "./builder/generate-raw-styles";
import generateColorRules from "./builder/generate-color-rules";
import generateThemeFiles from "./builder/generate-theme-files";
import generateThemesObject from "./builder/generate-themes-object";
import minifyCssInDirectory from "./builder/minify-css-in-directory";

import { version } from "./package.json";

const isDev = process.argv.includes("--dev");

const generateFiles = async () => {
  await Promise.all([
    copyFile(
      "./builder/theme-plugin.js",
      "./theme/theme-plugin.js",
      "index.js"
    ),

    !isDev &&
      generateColorRules({
        distDir: "../colors",
        properties: ["bg", "text", "border"],
        breakpoints: ["sm", "md", "lg", "xl", "2xl"],
        states: ["hover"],
        opacities: {
          properties: ["10", "20", "30", "40", "50", "60", "70", "80", "90"],
          responsive: [],
          states: [],
        },
        outputFiles: {
          properties: "properties.css",
          responsive: "responsive.css",
          states: "states.css",
        },
      }),

    !isDev &&
      generateColorRules({
        distDir: "../colors",
        properties: ["bg", "text", "border"],
        breakpoints: [],
        states: ["focus", "active"],
        outputFiles: {
          states: "states-extended.css",
        },
      }),

    !isDev &&
      generateColorRules({
        distDir: "../colors",
        properties: ["bg", "text", "border"],
        breakpoints: ["max-sm", "max-md", "max-lg", "max-xl", "max-2xl"],
        states: [],
        outputFiles: {
          responsive: "responsive-extended.css",
        },
      }),

    !isDev &&
      generateColorRules({
        distDir: "../colors",
        properties: [
          "from",
          "via",
          "to",
          "ring",
          // "ring-offset",
          "fill",
          "stroke",
          // "caret",
          // "divide",
          // "accent",
          "shadow",
          "outline",
          // "decoration",
          // "placeholder",
        ],
        breakpoints: [],
        states: [],
        outputFiles: {
          properties: "properties-extended.css",
        },
      }),

    !isDev && generateThemeFiles({ srcDir: "src/themes", distDir: "theme" }),

    !isDev &&
      generateRawStyles({
        srcDir: "../src/base",
        distDir: "../base",
        layer: "base",
      }),

    !isDev &&
      generateRawStyles({
        srcDir: "../src/components",
        distDir: "../components",
        responsive: true,
        exclude: [
          "calendar",
          "countdown",
          "loading",
          "filter",
          "mask",
          "mockup",
          "skeleton",
          "swap",
          "validator",
        ],
        layer: "utilities",
      }),

    !isDev &&
      generateRawStyles({
        srcDir: "../src/utilities",
        distDir: "../utilities",
        responsive: true,
        exclude: ["typography", "glass"],
        layer: "utilities",
      }),
    generatePlugins({ type: "base", srcDir: "src/themes", distDir: "theme" }),
    generatePlugins({
      type: "base",
      srcDir: "src/base",
      distDir: "base",
      exclude: ["reset"],
    }),
    generatePlugins({
      type: "component",
      srcDir: "src/components",
      distDir: "components",
    }),
    generatePlugins({
      type: "utility",
      srcDir: "src/utilities",
      distDir: "utilities",
    }),
  ]);

  await Promise.all([
    generateImports("imports.js"),

    !isDev && generateChunks("chunks.css"),

    !isDev &&
      packCss({
        outputFile: "umiui.css",
        exclude: {
          colors: [
            "properties-extended",
            "responsive-extended",
            "states-extended",
          ],
          components: [],
          utilities: [],
        },
      }),

    !isDev && generateThemes("themes.css"),
    generateThemesObject("./theme/object.js"),
  ]);

  await Promise.all([
    extractClasses({ srcDir: "components" }),
    !isDev &&
      minifyCssInDirectory(["colors", "base", "components", "utilities"]),
    !isDev && minify("themes.css"),
    !isDev && minify("umiui.css"),
  ]);
};

const build = async () => {
  try {
    !isDev &&
      (await removeFiles([
        "base",
        "colors",
        "components",
        "theme",
        "utilities",
        "chunks.css",
        "umiui.css",
        "imports.js",
        "themes.css",
      ]));

    console.time(`umiUI ${version}`);

    await generateFiles();

    console.timeEnd(`umiUI ${version}`);

    !isDev &&
      (await report([
        "base",
        "components",
        "utilities",
        "colors",
        "chunks.css",
        "themes.css",
        "umiui.css",
      ]));
  } catch (error) {
    throw new Error("Build error: " + error.message);
  }
};

build();
