import fs from "node:fs/promises";
import path from "node:path";

import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

import cleanCss from "./clean-css";
import loadThemes from "./load-themes";
import breakpoints from "./breakpoints";
import getFileNames from "./get-file-names";
import compileAndExtractStyles from "./compile-and-extract-styles";

const transformSelector = (selector, breakpoint) =>
  selectorParser((selectors) => {
    selectors.each((selector) => {
      if (selector.first.type === "class") {
        selector.first.value = `${breakpoint}:${selector.first.value}`;
      }
    });
  }).processSync(selector);

// escape breakpoint colons in CSS
const escapeBreakpointColon = (css, breakpoint) =>
  css.replace(new RegExp(`\\.${breakpoint}:`, "g"), `.${breakpoint}\\:`);

// wrap styles in layer
const wrapInLayer = (styles, layer) =>
  layer ? `@layer ${layer} {\n${styles}\n}` : styles;

// generate media query
const generateMediaQuery = (breakpoint, minWidth, styles) =>
  `\n@media (min-width: ${minWidth}) {\n${styles}\n}\n\n`;

const extractKeyframes = (root) => {
  let keyframesStyles = "";

  root.walkAtRules("keyframes", (atRule) => {
    keyframesStyles += atRule.toString();
    atRule.remove();
  });

  return keyframesStyles;
};

const generateResponsiveVariants = async (css) => {
  let responsiveStyles = "";
  const root = postcss.parse(css);

  const keyframesStyles = extractKeyframes(root);

  for (const [breakpoint, minWidth] of Object.entries(breakpoints)) {
    const prefixedCss = await postcss([
      (root) => {
        root.walkRules((rule) => {
          if (rule.parent.type === "root") {
            rule.selector = transformSelector(rule.selector, breakpoint);
          }
        });
      },
    ]).process(root.toString(), { from: undefined });

    const escapedCss = escapeBreakpointColon(prefixedCss.css, breakpoint);
    responsiveStyles += generateMediaQuery(breakpoint, minWidth, escapedCss);
  }

  return css + responsiveStyles + keyframesStyles;
};

const processFile = async (
  file,
  stylesDir,
  distDir,
  defaultTheme,
  theme,
  responsive,
  exclude,
  layer
) => {
  const styleContent = await fs.readFile(
    path.join(stylesDir, `${distDir}/${file}.css`),
    "utf-8"
  );

  let stylesContent = await compileAndExtractStyles(
    styleContent,
    defaultTheme,
    theme
  );

  if (responsive && !exclude.includes(file)) {
    stylesContent = await generateResponsiveVariants(stylesContent);
  }

  stylesContent = cleanCss(stylesContent);

  if (layer) {
    stylesContent = `@layer ${layer} {\n${stylesContent}\n}`;
  }

  await fs.writeFile(
    path.join(import.meta.dirname, distDir, `${distDir}/${file}.css`),
    stylesContent
  );
};

const generateRawStyles = async ({
  srcDir,
  distDir,
  responsive = false,
  exclude = [],
  layer = null,
}) => {
  try {
    const { defaultTheme, theme } = await loadThemes();

    const stylesDir = path.join(import.meta.dirname, srcDir);
    const files = await getFileNames(stylesDir, ".css", false);

    // Process all files concurrently
    const processPromises = files.map((file) =>
      processFile(
        file,
        stylesDir,
        distDir,
        defaultTheme,
        theme,
        responsive,
        exclude,
        layer
      ).catch((fileError) => {
        throw new Error(`Error processing file ${file}: ${fileError.message}`);
      })
    );

    // Wait for all files to be processed
    await Promise.all(processPromises);
  } catch (error) {
    console.error("An error occurred while generating raw styles:", error);
    process.exit(1);
  }
};

export default generateRawStyles;
