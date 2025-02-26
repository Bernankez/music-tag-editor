import type { AvailableLocales } from "@/utils/i18n";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const locale = ref<AvailableLocales>();

  const layoutSize = ref("300px");

  return {
    locale,
    layoutSize,
  };
}, {
  persist: true,
});
