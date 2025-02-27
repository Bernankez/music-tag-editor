import type { AvailableLocales } from "@/utils/i18n";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const locale = ref<AvailableLocales>();

  const layoutSize = ref("300px");
  const collapsed = ref(false);

  return {
    locale,
    layoutSize,
    collapsed,
  };
}, {
  persist: {
    omit: ["collapsed"],
  },
});
