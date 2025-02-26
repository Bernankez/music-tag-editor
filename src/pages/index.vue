<script setup lang="ts">
import { FormField } from "../components/ui/form";

const appStore = useAppStore();
const { layoutSize } = storeToRefs(appStore);

const collapsed = ref(false);
</script>

<template>
  <Split v-model:size="layoutSize" v-model:collapsed="collapsed" display-directive="show" direction="horizontal" min="250px" :max="0.7" :resize-trigger-size="1" :resize-trigger-dragging-size="8" class="h-full w-full">
    <template #1>
      <aside class="h-full bg-secondary">
        <form>
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="artist">
            <FormItem>
              <FormLabel>艺术家</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="album">
            <FormItem>
              <FormLabel>专辑</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
        </form>
      </aside>
    </template>
    <template #resize-trigger>
      <div class="h-full w-px bg-border"></div>
    </template>
    <template #2>
      <header class="flex items-center justify-between b-0 b-b-1 b-border bg-secondary/50 p-2">
        <Button variant="ghost" size="icon" @click="collapsed = !collapsed">
          <div class="i-ri:side-bar-line"></div>
        </Button>
        <div class="relative max-w-xs w-full items-center bg-background">
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
