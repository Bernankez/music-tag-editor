import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", () => {
  const usePointerCursor = ref(false);

  return {
    usePointerCursor,
  };
}, {
  persist: true,
});
