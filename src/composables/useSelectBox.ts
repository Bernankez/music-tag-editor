import type { MaybeComputedElementRef } from "@vueuse/core";

export interface UseSelectBoxOptions {
  /**
   * 是否显示选择框
   */
  showBox?: MaybeRefOrGetter<boolean>;
  /**
   * 是否固定选择框的起点（相对于boundaryEl）
   * @default true
   */
  fixStartAnchor?: MaybeRefOrGetter<boolean>;
  /**
   * 选择框的挂载元素
   * @default document.body
   */
  containerEl?: MaybeComputedElementRef<HTMLElement | null | undefined>;
  /**
   * 限制选择框的元素
   */
  boundaryEl?: MaybeComputedElementRef<HTMLElement | null | undefined>;
  /**
   * 可选择元素的选择器
   */
  selectableSelector?: string;
  onStart?: (e: MouseEvent) => void;
  onMove?: (e: MouseEvent) => void;
  onEnd?: (e: MouseEvent) => void;
}

export function useSelectBoxTemp(options?: UseSelectBoxOptions) {
  const { showBox = true, fixStartAnchor = true, containerEl, boundaryEl, selectableSelector = "[data-selectable]", onStart, onMove, onEnd } = options ?? {};

  const boxState = reactive({
    position: "absolute",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "hsl(var(--primary))",
    backgroundColor: "hsl(var(--primary) / 0.1)",
    zIndex: 999,
    startX: 0,
    startY: 0,
    startScrollX: 0,
    startScrollY: 0,
    x: 0,
    y: 0,
    show: false,
  });

  const mounted = useMounted();

  const boxElRef = shallowRef<HTMLDivElement>();
  const containerRef = computed(() => {
    if (isDefined(containerEl)) {
      return toValue(containerEl);
    }
    if (mounted.value) {
      return document.body;
    }
    return undefined;
  });

  /**
   * 初始化选择框
   */
  function initBox() {
    const div = document.createElement("div");

    // defines
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

    containerRef.value?.appendChild(div);
  }

  /**
   * 销毁选择框
   */
  function disposeBox() {
    if (boxElRef.value) {
      containerRef.value?.removeChild(boxElRef.value);
      boxElRef.value = undefined;
    }
  }

  /**
   * 更新选择框
   */
  function updateBox() {
    const div = boxElRef.value;
    if (!div) {
      return;
    }

    const { left, top, right, bottom } = getBoxPosition();

    // 使watchEffect追踪
    const renderState = {
      "--left": `${left}px`,
      "--top": `${top}px`,
      "--right": `${window.innerWidth - right}px`,
      "--bottom": `${window.innerHeight - bottom}px`,

      "--border-width": boxState.borderWidth,
      "--border-style": boxState.borderStyle,
      "--border-color": boxState.borderColor,
      "--background-color": boxState.backgroundColor,
      "--z-index": boxState.zIndex.toString(),
      "--position": boxState.position,
      "display": boxState.show ? "block" : "none",
    };

    requestAnimationFrame(() => {
      Object.entries(renderState).forEach(([key, value]) => {
        div.style.setProperty(key, value);
      });
    });
  }

  function getBoxPosition() {
    const boundary = toValue(boundaryEl);
    const { scrollLeft = 0, scrollTop = 0 } = boundary ?? {};
    const scrollX = scrollLeft - boxState.startScrollX;
    const scrollY = scrollTop - boxState.startScrollY;

    const startX = toValue(fixStartAnchor) ? boxState.startX - scrollX : boxState.startX;
    const startY = toValue(fixStartAnchor) ? boxState.startY - scrollY : boxState.startY;

    let left = Math.min(startX, boxState.x);
    let top = Math.min(startY, boxState.y);
    let right = Math.max(startX, boxState.x);
    let bottom = Math.max(startY, boxState.y);

    if (boundary) {
      const rect = boundary.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      // 转换为页面坐标
      const boundaryLeft = rect.left + scrollX;
      const boundaryTop = rect.top + scrollY;
      const boundaryRight = rect.right + scrollX;
      const boundaryBottom = rect.bottom + scrollY;

      // 限制选择框
      left = Math.max(left, boundaryLeft);
      top = Math.max(top, boundaryTop);
      right = Math.min(right, boundaryRight);
      bottom = Math.min(bottom, boundaryBottom);
    }

    return {
      left,
      top,
      right,
      bottom,
    };
  }

  watchEffect(() => {
    if (toValue(showBox) && mounted.value) {
      initBox();
    } else {
      disposeBox();
    }
  });

  watchEffect(() => {
    if (toValue(showBox)) {
      updateBox();
    }
  });

  function getElementsInSelection(): Element[] {
    const { left, top, right, bottom } = getBoxPosition();
    const selectableElements = document.querySelectorAll(selectableSelector);
    const selectedElements: Element[] = [];

    selectableElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementLeft = rect.left + window.scrollX;
      const elementTop = rect.top + window.scrollY;
      const elementRight = rect.right + window.scrollX;
      const elementBottom = rect.bottom + window.scrollY;

      if (elementLeft < right && elementRight > left && elementTop < bottom && elementBottom > top) {
        selectedElements.push(element);
      }
    });

    return selectedElements;
  }

  function onMouseDown(e: MouseEvent) {
    const boundary = toValue(boundaryEl);
    const { scrollLeft = 0, scrollTop = 0 } = boundary ?? {};

    boxState.startX = e.pageX;
    boxState.startY = e.pageY;
    boxState.startScrollX = scrollLeft;
    boxState.startScrollY = scrollTop;
    boxState.x = e.pageX;
    boxState.y = e.pageY;
    onStart?.(e);

    const stopMoveFn = useEventListener(window, "mousemove", (e) => {
      boxState.x = e.pageX;
      boxState.y = e.pageY;
      boxState.show = true;
      onMove?.(e);
    });

    const stopUpFn = useEventListener(window, "mouseup", (e) => {
      boxState.x = e.pageX;
      boxState.y = e.pageY;
      stopMoveFn();
      stopUpFn();
      boxState.show = false;
      onEnd?.(e);
    });
  }

  return {
    onMouseDown,
    isDragging: computed(() => boxState.show),
    getElementsInSelection,

    initBox,
    disposeBox,
    updateBox,
  };
}
