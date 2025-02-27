<script setup lang="ts">
import Header from "./layout/Header.vue";
import Sidebar from "./layout/Sidebar.vue";

const appStore = useAppStore();
const { layoutSize, collapsed } = storeToRefs(appStore);
</script>

<template>
  <Split v-model:size="layoutSize" v-model:collapsed="collapsed" display-directive="show" direction="horizontal" min="250px" :max="0.7" :resize-trigger-size="1" :resize-trigger-dragging-size="8" class="h-full w-full">
    <template #1>
      <Sidebar />
    </template>
    <template #resize-trigger>
      <div class="h-full w-px bg-border"></div>
    </template>
    <template #2>
      <Header />
      <main>main</main>
    </template>
  </Split>
</template>
