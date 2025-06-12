import path from 'node:path';

import { defineConfig } from "vite";

import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss()],
  build: {
    lib: {
      name: 'umiui-solid-js',
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd'],
      fileName: (format) => `umiui-solid-js.${format}.js`,
    },
  },
});
