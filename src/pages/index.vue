<script setup lang="ts">
// eslint-disable-next-line unused-imports/no-unused-vars
const appStore = useAppStore();

const sidebarRef = useTemplateRef("sidebarRef");
</script>

<template>
  <Split ref="sidebarRef" direction="horizontal" :resize-trigger-size="1" :resize-trigger-dragging-size="8" class="h-full w-full">
    <template #1>
      <aside>ff</aside>
    </template>
    <template #resize-trigger>
      <div class="h-full w-px bg-border"></div>
    </template>
    <template #2>
      <header class="flex items-center b-0 b-b-1 b-border p-2">
        <Button variant="ghost" size="icon">
          <div class="i-ri:side-bar-line"></div>
        </Button>
        <div class="relative max-w-sm w-full items-center">
          <Input id="search" type="text" placeholder="Search..." class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
            <div class="i-ri:search-line text-muted-foreground"></div>
          </span>
        </div>
      </header>
      <main>main</main>
    </template>
  </Split>
</template>
