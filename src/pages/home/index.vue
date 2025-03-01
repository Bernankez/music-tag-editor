<script setup lang="ts">
import type { Payment } from "./layout/FileTable/FileTableColumn";
import { columns } from "./layout/FileTable/FileTableColumn";
import Header from "./layout/Header.vue";
import Sidebar from "./layout/Sidebar.vue";

const appStore = useAppStore();
const { layoutSize, collapsed } = storeToRefs(appStore);

const data = ref<Payment[]>([]);

const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
];

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return payments;
}

onMounted(async () => {
  data.value = await getData();
});
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
      <Header />
      <main class="w-200">
        <!-- <FileTable :columns :data /> -->
        <MiniTable :columns :data />
      </main>
    </template>
  </Split>
</template>
