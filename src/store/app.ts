import type { AvailableLocales } from "@/utils/i18n";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const locale = ref<AvailableLocales>();

  const layout = ref<number[]>([20, 80]);

  return {
    locale,
    layout,
  };
}, {
  persist: true,
});
