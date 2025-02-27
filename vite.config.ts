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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
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
});
