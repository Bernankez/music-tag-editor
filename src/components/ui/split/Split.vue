<script setup lang="ts">
import { useMergedState } from "@bernankez/utils/vue";
import { useEventListener } from "@vueuse/core";
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{
  direction?: "horizontal" | "vertical";
  resizeTriggerSize?: number;
  resizeTriggerSublineSize?: number;
  min?: number | string;
  max?: number | string;
}>(), {
  direction: "horizontal",
  resizeTriggerSize: 12,
  min: 0,
  max: 1,
});

const cursor = computed(() => props.direction === "vertical" ? "ns-resize" : "ew-resize");
const resizeWrapperStyle = computed(() => calculateStyle(props.resizeTriggerSize));

function calculateStyle(size: number) {
  return props.direction === "vertical"
    ? ({
        height: `${size}px`,
        width: "100%",
      })
    : ({
        width: `${size}px`,
        height: "100%",
      });
}

const uncontrolledSize = ref(0.5);
const controlledSize = defineModel<string | number>("size");

const size = useMergedState(controlledSize, uncontrolledSize);

const offset = ref(0);
const slot1Style = computed(() => {
  const sizeValue = size.value;
  if (typeof sizeValue === "string") {
    return {
      flex: `0 0 ${sizeValue}`,
    };
  } else {
    const _size = sizeValue * 100;
    return {
      flex: `0 0 calc(${_size}% - ${
        (props.resizeTriggerSize * _size) / 100
      }px)`,
    };
  }
});

const resizeTriggerRef = ref<HTMLDivElement>();

const dragging = ref(false);

function onMouseDown(e: MouseEvent) {
  e.preventDefault();
  dragging.value = true;
  const bodyCursor = document.body.style.cursor;
  document.body.style.cursor = cursor.value;

  const offMouseMove = useEventListener(document, "mousemove", onMouseMove);
  const offMouseUp = useEventListener(document, "mouseup", onMouseUp);

  function onMouseMove(e: MouseEvent) {
    updateSize(e);
  }

  function onMouseUp(e: MouseEvent) {
    updateSize(e);
    offMouseMove();
    offMouseUp();
    dragging.value = false;
    document.body.style.cursor = bodyCursor;
  }

  const resizeTriggerEl = resizeTriggerRef.value;
  if (resizeTriggerEl) {
    const elRect = resizeTriggerEl.getBoundingClientRect();
    if (props.direction === "horizontal") {
      offset.value = e.clientX - elRect.left;
    } else {
      offset.value = elRect.top - e.clientY;
    }
  }
  updateSize(e);
}

function depx(px: string | number) {
  if (typeof px === "string") {
    if (px.endsWith("px")) {
      return Number(px.slice(0, px.length - 2));
    }
    return Number(px);
  }
  return px;
}

function updateSize(e: MouseEvent) {
  const containerRect = resizeTriggerRef.value?.parentElement?.getBoundingClientRect();
  if (!containerRect) {
    return;
  }
  const { direction } = props;
  const containerUsableWidth = containerRect.width - props.resizeTriggerSize;
  const containerUsableHeight
        = containerRect.height - props.resizeTriggerSize;
  const containerUsableSize
        = direction === "horizontal"
          ? containerUsableWidth
          : containerUsableHeight;

  const newPxSize
        = direction === "horizontal"
          ? e.clientX - containerRect.left - offset.value
          : e.clientY - containerRect.top + offset.value;

  const { min, max } = props;

  const pxMin
        = typeof min === "string" ? depx(min) : min * containerUsableSize;
  const pxMax
        = typeof max === "string" ? depx(max) : max * containerUsableSize;

  let nextPxSize = newPxSize;
  nextPxSize = Math.max(nextPxSize, pxMin);
  nextPxSize = Math.min(nextPxSize, pxMax, containerUsableSize);
  // in pixel mode
  if (typeof size.value === "string") {
    size.value = `${nextPxSize}px`;
  } else {
    // in percentage mode
    size.value = nextPxSize / containerUsableSize;
  }
}
</script>

<template>
  <div class="flex" :class="[direction === 'vertical' ? 'flex-col' : '']">
    <div :style="slot1Style" class="w-full overflow-auto">
      <slot name="1"></slot>
    </div>
    <div ref="resizeTriggerRef" :style="{ ...resizeWrapperStyle, cursor }" class="group flex shrink-0 grow-0 items-center" :class="[props.direction === 'vertical' && 'flex-col']" @mousedown="onMouseDown">
      <slot name="resize-trigger">
        <div class="rounded-full bg-muted-foreground bg-opacity-50 transition-200 transition-all group-hover:bg-opacity-80" :class="[props.direction === 'vertical' ? 'w-12 h-full my-2px' : 'h-12 w-full mx-2px', dragging ? props.direction === 'vertical' ? 'w-15 bg-opacity-80' : 'h-15 bg-opacity-80' : '']"></div>
      </slot>
    </div>
    <div class="w-full overflow-auto">
      <slot name="2"></slot>
    </div>
  </div>
</template>
