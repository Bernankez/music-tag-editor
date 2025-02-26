import { defineConfig, presetIcons, presetTypography, presetWind3, transformerDirectives } from "unocss";
import presetShadcn from "./preset.shadcn";

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.tsx?$/, /\.vue$/, /\.vue\?vue/],
    },
  },
  presets: [presetWind3(), presetTypography(), presetShadcn(), presetIcons({
    scale: 1.5,
  })],
  transformers: [transformerDirectives()],
  shortcuts: [
    {
      "animate-accordion-up": "accordion-up",
      "animate-accordion-down": "accordion-down",
    },
  ],
});
