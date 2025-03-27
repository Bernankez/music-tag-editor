/// <reference types="vitest" />

import { resolve } from "node:path";
import { UtilsResolver } from "@bernankez/utils/resolver";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Info from "unplugin-info/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import VueDevTools from "vite-plugin-vue-devtools";
import { VueMcp } from "vite-plugin-vue-mcp";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueMcp(),
    UnoCSS(),
    AutoImport({
      imports: [
        "vue",
        "vue-i18n",
        "vue-router",
        "@vueuse/core",
        "pinia",
      ],
      dirs: ["./src/composables/**", "./src/store/**", "./src/utils/**"],
      vueTemplate: true,
      resolvers: [UtilsResolver()],
    }),
    Components({
      types: [{
        from: "vue-router",
        names: ["RouterLink", "RouterView"],
      }],
    }),
    VueDevTools(),
    Info(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "~": resolve(__dirname, "."),
    },
  },
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/._*",
    ],
  },
});
