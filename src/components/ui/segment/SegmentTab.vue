<script setup lang="ts">
import { isDefined, noop } from "@vueuse/core";
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  CurrentValueKey,
  RegisterValueKey,
  SegmentRegisterElementKey,
  UpdateValueKey,
} from "./index";

const props = defineProps<{
  value: string;
}>();

const emit = defineEmits<{
  (e: "click", value: string): void;
}>();

const registerElement = inject(SegmentRegisterElementKey, noop);
const registerValue = inject(RegisterValueKey, noop);
const currentValue = inject(CurrentValueKey, ref());
const updateValue = inject(UpdateValueKey, noop);
const rootEl = ref<HTMLDivElement | null>(null);

const isActive = computed(() => currentValue.value === props.value);

watch(
  () => props.value,
  (value) => {
    if (isDefined(value)) {
      registerValue(value);
    }
  },
  { immediate: true },
);

function onClick() {
  updateValue(props.value);
  emit("click", props.value);
}

onMounted(() => {
  registerElement(props.value, rootEl.value);
});

onBeforeUnmount(() => {
  registerElement(props.value, null);
});
</script>

<template>
  <div
    ref="rootEl" class="shrink-0 select-none px-3 py-1 text-sm transition-colors duration-200 cursor-pointer"
    :class="[
      isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground',
    ]"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>
