<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/utils/shadcn";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div class="relative w-full">
    <table :class="cn('w-full caption-bottom text-sm', props.class)">
      <slot></slot>
    </table>
  </div>
</template>
