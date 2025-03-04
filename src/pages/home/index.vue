<script setup lang="ts">
import FileTable from "./layout/FileTable/FileTable.vue";
import Header from "./layout/Header.vue";
import Sidebar from "./layout/Sidebar.vue";
import StatusBar from "./layout/StatusBar.vue";

const appStore = useAppStore();
const { layoutSize, collapsed } = storeToRefs(appStore);

const { onMouseDown } = useSelectBox();
</script>

<template>
  <Split v-model:size="layoutSize" v-model:collapsed="collapsed" display-directive="show" direction="horizontal" min="300px" :max="0.7" :resize-trigger-size="1" :resize-trigger-dragging-size="8" class="h-full w-full">
    <template #1>
      <Sidebar />
    </template>
    <template #resize-trigger>
      <div class="h-full w-px bg-border"></div>
    </template>
    <template #2>
      <div class="h-full flex flex-col">
        <Header />
        <main class="h-full overflow-auto" @mousedown="onMouseDown">
          <FileTable />
        </main>
        <StatusBar />
      </div>
    </template>
  </Split>
</template>
