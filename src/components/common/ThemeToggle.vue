<script setup lang="ts">
const { store } = useColorMode();
const { state, next } = useCycleList(["auto", "light", "dark"] as const, { initialValue: store });
watchEffect(() => {
  store.value = state.value;
});
</script>

<template>
  <Button @click="() => next()">
    Toggle
  </Button>
</template>
