<script setup lang="ts">
import { useMergedState } from "@bernankez/utils/vue";
import { useEventListener } from "@vueuse/core";
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{
  direction?: "horizontal" | "vertical";
  /** 分割条大小 */
  resizeTriggerSize?: number;
  /** 分割条可触发拖动区域大小 */
  resizeTriggerDraggingSize?: number;
  /**
   * 最小尺寸
   * string - 为string时，单位px - '230px' | '230'
   * number - 为number时，作为百分比 - 0.23（23%）
   */
  min?: number | string;
  /**
   * 最大尺寸
   * string - 为string时，单位px - '230px' | '230'
   * number - 为number时，作为百分比 - 0.23（23%）
   */
  max?: number | string;
}>(), {
  direction: "horizontal",
  resizeTriggerSize: 8,
  resizeTriggerDraggingSize: 6,
  min: 0,
  max: 1,
});

const cursor = computed(() => props.direction === "vertical" ? "ns-resize" : "ew-resize");
const resizeWrapperStyle = computed(() => calculateStyle(props.resizeTriggerSize));
const resizeWrapperDraggingStyle = computed(() => {
  const size = `${props.resizeTriggerDraggingSize / 2}px`;
  let sizeWidth: string, sizeHeight: string;
  let beforeTop: string, beforeBottom: string, beforeLeft: string, beforeRight: string;
  let afterTop: string, afterBottom: string, afterLeft: string, afterRight: string;
  if (props.direction === "horizontal") {
    sizeWidth = size;
    sizeHeight = "100%";

    beforeTop = "0";
    beforeBottom = "0";
    beforeRight = "100%";
    beforeLeft = "unset";

    afterTop = "0";
    afterBottom = "0";
    afterLeft = "100%";
    afterRight = "unset";
  } else {
    sizeWidth = "100%";
    sizeHeight = size;

    beforeLeft = "0";
    beforeRight = "0";
    beforeBottom = "100%";
    beforeTop = "unset";

    afterLeft = "0";
    afterRight = "0";
    afterTop = "100%";
    afterBottom = "unset";
  }
  return {
    "--size-width": sizeWidth,
    "--size-height": sizeHeight,

    "--before-top": beforeTop,
    "--before-bottom": beforeBottom,
    "--before-left": beforeLeft,
    "--before-right": beforeRight,

    "--after-top": afterTop,
    "--after-bottom": afterBottom,
    "--after-left": afterLeft,
    "--after-right": afterRight,
  };
});

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

function updateSize(e?: MouseEvent) {
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

  let newPxSize: number;
  if (e) {
    newPxSize
        = direction === "horizontal"
        ? e.clientX - containerRect.left - offset.value
        : e.clientY - containerRect.top + offset.value;
  } else if (typeof size.value === "string") {
    newPxSize = depx(size.value);
  } else {
    newPxSize = size.value * containerUsableSize;
  }

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

const wrapperElRef = useTemplateRef("wrapperElRef");

useResizeObserver(wrapperElRef, () => {
  updateSize();
});
</script>

<template>
  <div ref="wrapperElRef" class="flex" :class="[direction === 'vertical' ? 'flex-col' : '']">
    <div :style="slot1Style" class="w-full overflow-auto">
      <slot name="1"></slot>
    </div>
    <div ref="resizeTriggerRef" :style="{ ...resizeWrapperStyle, ...resizeWrapperDraggingStyle, cursor }" class="group resize-trigger-wrapper relative flex shrink-0 grow-0 items-center" :class="[props.direction === 'vertical' && 'flex-col']" @mousedown="onMouseDown">
      <slot name="resize-trigger" :dragging>
        <div class="rounded-full bg-muted-foreground bg-opacity-50 transition-200 transition-all group-hover:bg-opacity-80" :class="[props.direction === 'vertical' ? 'w-12 h-full' : 'h-12 w-full', dragging ? props.direction === 'vertical' ? 'w-15 bg-opacity-80' : 'h-15 bg-opacity-80' : '']"></div>
      </slot>
    </div>
    <div class="h-full w-full overflow-auto">
      <slot name="2"></slot>
    </div>
  </div>
</template>

<style scoped>
.resizeTriggerWrapper {
  --size-width: 0;
  --size-height: 0;

  --before-top: 0;
  --before-bottom: 0;
  --before-left: 0;
  --before-right: 0;

  --after-top: 0;
  --after-bottom: 0;
  --after-left: 0;
  --after-right: 0;
}

.resize-trigger-wrapper::before {
  content: "";
  position: absolute;
  top: var(--before-top);
  right: var(--before-right);
  bottom: var(--before-bottom);
  left: var(--before-left);
  width: var(--size-width);
  height: var(--size-height);
}

.resize-trigger-wrapper::after {
  content: "";
  position: absolute;
  top: var(--after-top);
  right: var(--after-right);
  bottom: var(--after-bottom);
  left: var(--after-left);
  width: var(--size-width);
  height: var(--size-height);
}
</style>
