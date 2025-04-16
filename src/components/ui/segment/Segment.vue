<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import {
  CurrentValueKey,
  RegisterValueKey,
  SegmentRegisterElementKey,
  UpdateValueKey,
} from "./index";

const props = defineProps<{
  defaultValue?: string;
}>();
// Model & Props
const activeValue = defineModel<string | undefined>({ default: undefined });
// State
const segmentRef = ref<HTMLDivElement>();
const tabElements = ref(new Map<string, HTMLElement | null>());
const registeredValues = ref<string[]>([]);
const indicatorStyle = ref<{
  width: string;
  transform: string;
  opacity: number;
}>({ width: "0px", transform: "translateX(0px)", opacity: 0 });
let observer: MutationObserver | null = null;

// Watch
watch(activeValue, () => {
  nextTick(updateIndicator);
}, { flush: "post" });

// Lifecycle Hooks
onMounted(() => {
  nextTick(() => {
    // Apply defaultValue only if modelValue (activeValue) is initially undefined
    if (activeValue.value === undefined && props.defaultValue !== undefined) {
      // Check if defaultValue is actually registered before setting
      if (registeredValues.value.includes(props.defaultValue)) {
        activeValue.value = props.defaultValue;
      } else {
        // Optional: Warn if defaultValue is provided but not registered
        console.warn(
          `Segment defaultValue "${props.defaultValue}" is not a registered value.`,
        );
      }
    }
    // Ensure indicator updates after potential defaultValue application
    updateIndicator();
  });

  // Setup MutationObserver
  observer = new MutationObserver(() => {
    nextTick(updateIndicator);
  });

  if (segmentRef.value) {
    observer.observe(segmentRef.value, {
      childList: true,
      subtree: false,
    });
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Methods
function registerValue(value: string) {
  if (!registeredValues.value.includes(value)) {
    registeredValues.value.push(value);
  }
}

function updateValue(value: string) {
  activeValue.value = value;
  nextTick(updateIndicator); // Ensure indicator updates after manual value update
}

function registerTabElement(value: string, el: HTMLElement | null) {
  if (el) {
    tabElements.value.set(value, el);
  } else {
    tabElements.value.delete(value);
  }
  nextTick(updateIndicator);
}

function updateIndicator() {
  // Reset style initially or if conditions aren't met
  indicatorStyle.value = { width: "0px", transform: "translateX(0px)", opacity: 0 };

  if (!segmentRef.value || activeValue.value === undefined) {
    return; // Already reset or no active value
  }

  const container = segmentRef.value;
  const activeTabElement = tabElements.value.get(activeValue.value);

  // Check if activeTabElement exists and is a valid HTMLElement and part of the container
  if (activeTabElement instanceof HTMLElement && container.contains(activeTabElement)) {
    const offsetLeft = activeTabElement.offsetLeft;
    const offsetWidth = activeTabElement.offsetWidth;

    // Only update if the element has a measurable width
    if (offsetWidth > 0) {
      indicatorStyle.value = {
        width: `${offsetWidth}px`,
        transform: `translateX(${offsetLeft}px)`,
        opacity: 1,
      };
    }
    // If offsetWidth is 0, the style remains reset (invisible indicator)
  }
  // If element not found or invalid, the style remains reset
}

// Provide
provide(CurrentValueKey, activeValue);
provide(UpdateValueKey, updateValue);
provide(RegisterValueKey, registerValue);
provide(SegmentRegisterElementKey, registerTabElement);
</script>

<template>
  <div ref="segmentRef" class="relative inline-flex items-center rounded-lg bg-muted p-1">
    <!-- Indicator -->
    <div
      class="absolute bottom-1 left-0 h-[calc(100%-0.5rem)] rounded-md bg-background shadow transition-all duration-300 ease-out"
      :style="indicatorStyle"
    ></div>
    <!-- Tabs Slot -->
    <slot></slot>
  </div>
</template>

<style scoped>
/* Add any necessary scoped styles here */
/* Ensure child elements have relative positioning or z-index if needed to appear above the indicator */
:slotted(*) {
  position: relative; /* Or use z-index */
}
</style>
