import type { MaybeComputedElementRef } from "@vueuse/core";

export interface UseSelectBoxOptions {
  /**
   * Whether to show the select box
   */
  showBox?: MaybeRefOrGetter<boolean>;
  /**
   * The element that triggers the select box
   */
  triggerEl?: MaybeComputedElementRef<HTMLElement | null | undefined>;
  /**
   * The element that limits the select box
   */
  boundaryEl?: MaybeComputedElementRef<HTMLElement | null | undefined>;
  /**
   * The selector of the elements that can be selected
   */
  selectableSelector?: string;
  onStart?: (e: MouseEvent) => void;
  onMove?: (e: MouseEvent) => void;
  onEnd?: (e: MouseEvent) => void;
}

export function useSelectBox(options?: UseSelectBoxOptions) {
  const {
    showBox = true,
    triggerEl,
    boundaryEl,
    selectableSelector = "[data-selectable]",
    onStart,
    onMove,
    onEnd,
  } = options || {};

  const boxElRef = shallowRef<HTMLDivElement | null | undefined>();

  const state = reactive({
    position: "fixed",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "hsl(var(--primary))",
    backgroundColor: "hsl(var(--primary) / 0.1)",
    zIndex: 999,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    show: false,
  });

  const mounted = useMounted();

  function initBoxEl() {
    const div = document.createElement("div");

    // defs
    div.style.setProperty("position", "var(--position)");

    div.style.setProperty("left", "var(--left)");
    div.style.setProperty("right", "var(--right)");
    div.style.setProperty("top", "var(--top)");
    div.style.setProperty("bottom", "var(--bottom)");

    div.style.setProperty("border-width", "var(--border-width)");
    div.style.setProperty("border-style", "var(--border-style)");
    div.style.setProperty("border-color", "var(--border-color)");

    div.style.setProperty("background-color", "var(--background-color)");

    div.style.setProperty("z-index", "var(--z-index)");

    div.style.setProperty("pointer-events", "none");
    div.style.setProperty("box-sizing", "border-box");

    boxElRef.value = div;
    document.body.appendChild(div);
  }

  function disposeBoxEl() {
    const div = boxElRef.value;
    if (!div) {
      return;
    }
    document.body.removeChild(div);
    boxElRef.value = undefined;
  }

  function getElementsInSelection(): Element[] {
    const left = Math.min(state.startX, state.x);
    const top = Math.min(state.startY, state.y);
    const right = Math.max(state.startX, state.x);
    const bottom = Math.max(state.startY, state.y);

    // 获取所有可选择的元素
    const selectableElements = document.querySelectorAll(selectableSelector);
    const selectedElements: Element[] = [];

    selectableElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementLeft = rect.left + window.scrollX;
      const elementTop = rect.top + window.scrollY;
      const elementRight = rect.right + window.scrollX;
      const elementBottom = rect.bottom + window.scrollY;

      // 检查元素是否与选择框重叠
      if (
        elementLeft < right
        && elementRight > left
        && elementTop < bottom
        && elementBottom > top
      ) {
        selectedElements.push(element);
      }
    });

    return selectedElements;
  }

  function updateBoxEl() {
    const div = boxElRef.value;
    if (!div) {
      return;
    }

    let left = Math.min(state.startX, state.x);
    let top = Math.min(state.startY, state.y);
    let right = Math.max(state.startX, state.x);
    let bottom = Math.max(state.startY, state.y);

    // If the boundary is set, limit the selection box
    const boundary = toValue(boundaryEl);
    if (boundary) {
      const rect = boundary.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      // Convert to page coordinates
      const boundaryLeft = rect.left + scrollX;
      const boundaryTop = rect.top + scrollY;
      const boundaryRight = rect.right + scrollX;
      const boundaryBottom = rect.bottom + scrollY;

      // Limit the selection box
      left = Math.max(left, boundaryLeft);
      top = Math.max(top, boundaryTop);
      right = Math.min(right, boundaryRight);
      bottom = Math.min(bottom, boundaryBottom);
    }

    div.style.setProperty("--left", `${left}px`);
    div.style.setProperty("--top", `${top}px`);
    div.style.setProperty("--right", `${window.innerWidth - right}px`);
    div.style.setProperty("--bottom", `${window.innerHeight - bottom}px`);
    div.style.setProperty("--border-width", state.borderWidth);
    div.style.setProperty("--border-style", state.borderStyle);
    div.style.setProperty("--border-color", state.borderColor);
    div.style.setProperty("--background-color", state.backgroundColor);
    div.style.setProperty("--z-index", state.zIndex.toString());
    div.style.setProperty("--position", state.position);
    div.style.setProperty("display", state.show ? "block" : "none");
  }

  watchEffect(() => {
    if (toValue(showBox) && mounted.value) {
      initBoxEl();
    } else {
      disposeBoxEl();
    }
  });

  watchEffect(() => {
    if (toValue(showBox)) {
      updateBoxEl();
    }
  });

  function onMouseDown(e: MouseEvent) {
    // 检查事件是否发生在指定容器内
    const trigger = toValue(triggerEl);
    if (trigger && !trigger.contains(e.target as Node)) {
      return;
    }

    state.startX = e.pageX;
    state.startY = e.pageY;
    state.x = e.pageX;
    state.y = e.pageY;
    onStart?.(e);

    const stopMoveFn = useEventListener(window, "mousemove", (e) => {
      state.x = e.pageX;
      state.y = e.pageY;
      state.show = true;

      // 获取当前选中的元素
      // const selectedElements = getElementsInSelection();
      onMove?.(e);
    });

    const stopUpFn = useEventListener(window, "mouseup", (e) => {
      state.x = e.pageX;
      state.y = e.pageY;
      stopMoveFn();
      stopUpFn();

      // 获取最终选中的元素
      // const selectedElements = getElementsInSelection();

      state.show = false;
      onEnd?.(e);
    });
  }

  return {
    onMouseDown,
    isDragging: computed(() => state.show),
    getSelectedElements: getElementsInSelection,
  };
}
