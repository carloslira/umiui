// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "umi UI",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "Components",
          items: [{ label: "Button", link: "components/button" }],
        },
      ],
      customCss: ["./src/styles/global.css"],
    }),
    solidJs(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
