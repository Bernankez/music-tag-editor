import type { Ref } from "vue";
import { useEventListener } from "@vueuse/core";
import { ref } from "vue";
import { useSelectBoxTemp } from "~/src/composables/useSelectBox";

export interface MiniTableInstance {
  getSelectedRowIds: () => string[];
  select: (id: string, exclusive: boolean) => void;
  unselect: (id: string) => void;
  clearSelection: () => void;
}

interface UseDraggableTableSelectionOptions {
  tableRef: Ref<MiniTableInstance | null>;
  boundaryRef: Ref<HTMLElement | null>;
}

export function useDraggableTableSelection({ tableRef, boundaryRef }: UseDraggableTableSelectionOptions) {
  const justFinishedInteraction = ref(false); // 标记交互刚结束
  const didDrag = ref(false); // 标记是否实际拖拽
  const isCtrlDragActive = ref(false); // 标记是否为加选模式

  const {
    onMouseDown: startDragSelection,
    isDragging,
    updateBox,
    getElementsInSelection,
  } = useSelectBoxTemp({
    boundaryEl: boundaryRef,
    onStart(event) {
      didDrag.value = false;
      isCtrlDragActive.value = event.ctrlKey || event.metaKey || event.shiftKey;
    },
    onMove() {
      didDrag.value = true;

      const currentBoxElements = getElementsInSelection();
      const currentBoxIds = new Set(
        currentBoxElements.map((el: Element) => el.getAttribute("data-id")).filter(Boolean) as string[],
      );
      const currentSelectedIds = new Set(tableRef.value?.getSelectedRowIds() ?? []);

      if (isCtrlDragActive.value) {
        // 加选模式: 只选择框内尚未选中的元素
        const idsToSelect = [...currentBoxIds].filter(id => !currentSelectedIds.has(id));
        idsToSelect.forEach(id => tableRef.value?.select(id, false));
      } else {
        // 替换选择模式
        const idsToSelect = [...currentBoxIds].filter(id => !currentSelectedIds.has(id));
        const idsToUnselect = [...currentSelectedIds].filter(id => !currentBoxIds.has(id));
        idsToSelect.forEach(id => tableRef.value?.select(id, false));
        idsToUnselect.forEach(id => tableRef.value?.unselect(id));
      }
    },
    onEnd(event) {
      if (didDrag.value || event.ctrlKey || event.metaKey || event.shiftKey) {
        justFinishedInteraction.value = true;
        setTimeout(() => {
          justFinishedInteraction.value = false;
        }, 50);
      }
      didDrag.value = false;
      isCtrlDragActive.value = false;
    },
  });

  useEventListener(boundaryRef, "scroll", updateBox);

  function handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const container = boundaryRef.value;

    if (target.closest("thead") || target.classList.contains("resizer")) {
      return;
    }

    if (target === container || target.tagName === "TD") {
      startDragSelection(event);
    }
  }

  function handleClickBlank(_e: MouseEvent) {
    if (!isDragging.value && !justFinishedInteraction.value) {
      tableRef.value?.clearSelection();
    }
  }

  return {
    isDragging,
    handleMouseDown,
    handleClickBlank,
  };
}
