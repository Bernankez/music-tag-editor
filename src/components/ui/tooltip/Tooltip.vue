<script setup lang="ts">
import type { TooltipRootEmits, TooltipRootProps } from "reka-ui";
import { TooltipRoot, useForwardPropsEmits } from "reka-ui";

const props = defineProps<TooltipRootProps & {
  content?: string;
}>();
const emits = defineEmits<TooltipRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <TooltipProvider>
    <TooltipRoot v-bind="forwarded">
      <TooltipTrigger as-child>
        <slot></slot>
      </TooltipTrigger>
      <TooltipContent>
        <slot name="content">
          {{ content }}
        </slot>
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>
