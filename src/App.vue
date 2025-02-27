<script setup lang="ts">
const settingsStore = useSettingsStore();

const mounted = useMounted();

watchEffect(() => {
  if (mounted.value) {
    const root = document.documentElement;
    root.style.setProperty("--pointer", settingsStore.usePointerCursor ? "pointer" : "default");
  }
});
</script>

<template>
  <RouterView />
</template>
