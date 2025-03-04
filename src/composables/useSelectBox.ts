export interface UseSelectBoxOptions {
  showBox?: MaybeRefOrGetter<boolean>;
  onStart?: (e: MouseEvent) => void;
  onMove?: (e: MouseEvent) => void;
  onEnd?: (e: MouseEvent) => void;
}

export function useSelectBox(options?: UseSelectBoxOptions) {
  const { showBox = true, onStart, onMove, onEnd } = options || {};

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

  function updateBoxEl() {
    const div = boxElRef.value;
    if (!div) {
      return;
    }
    const left = Math.min(state.startX, state.x);
    const top = Math.min(state.startY, state.y);
    const right = Math.max(state.startX, state.x);
    const bottom = Math.max(state.startY, state.y);

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
    state.startX = e.pageX;
    state.startY = e.pageY;
    state.x = e.pageX;
    state.y = e.pageY;
    onStart?.(e);

    const stopMoveFn = useEventListener(window, "mousemove", (e) => {
      state.x = e.pageX;
      state.y = e.pageY;
      state.show = true;
      onMove?.(e);
    });

    const stopUpFn = useEventListener(window, "mouseup", () => {
      state.x = e.pageX;
      state.y = e.pageY;
      stopMoveFn();
      stopUpFn();
      state.show = false;
      onEnd?.(e);
    });
  }

  return {
    onMouseDown,
    isDragging: computed(() => state.show),
  };
}
