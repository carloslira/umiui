import fs from "fs/promises";
import path from "path";

const loadThemes = async () => {
  const [defaultTheme, theme] = await Promise.all([
    fs.readFile(
      path.join(
        import.meta.dirname,
        "../../../node_modules/tailwindcss/theme.css"
      ),
      "utf-8"
    ),
    fs.readFile(path.join(import.meta.dirname, "./variables.css"), "utf-8"),
  ]);

  return { defaultTheme, theme };
};

export default loadThemes;
