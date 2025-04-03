import type { Row } from "@tanstack/vue-table";

export function useRowClicked<TData>(rowIds: MaybeRefOrGetter<string[]>) {
  // Record<id, string>
  const rowSelection = reactive<Record<string, boolean>>({});
  const lastSelectedRowId = shallowRef<string>();
  const lastSelectedRowIndex = computed(() => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) {
      return 0;
    } else if (selectedIds.length === 1) {
      return toValue(rowIds).indexOf(selectedIds[0]);
    } else if (isDefined(lastSelectedRowId.value)) {
      return toValue(rowIds).indexOf(lastSelectedRowId.value);
    }
    return 0;
  });

  function isSelected(id: string) {
    return !!rowSelection[id];
  }

  function clear() {
    Object.keys(rowSelection).forEach((key) => {
      unselect(key);
    });
    lastSelectedRowId.value = undefined;
    resetShiftStartIndex();
  }

  function select(id: string, emit = true) {
    if (isSelected(id)) {
      return;
    }
    rowSelection[id] = true;
    if (emit) {
      lastSelectedRowId.value = id;
    }
  }

  function unselect(id: string) {
    if (!isSelected(id)) {
      return;
    }
    delete rowSelection[id];
  }

  // handle ctrl key
  function clickWithCtrl(row: Row<TData>) {
    if (isSelected(row.id)) {
      unselect(row.id);
    } else {
      select(row.id);
      lastSelectedRowId.value = row.id;
    }
  }

  // handle shift key
  const shiftStartIndex = ref<number>();
  function resetShiftStartIndex() {
    shiftStartIndex.value = undefined;
  }
  function _selectRange(startIndex: number, endIndex: number, _select: boolean) {
    for (let i = startIndex; i <= endIndex; i++) {
      if (_select) {
        select(toValue(rowIds)[i], false);
      } else {
        unselect(toValue(rowIds)[i]);
      }
    }
  }
  function clickWithShift(row: Row<TData>) {
    if (!isDefined(shiftStartIndex.value)) {
      shiftStartIndex.value = lastSelectedRowIndex.value;
    } else {
      // clear previous selection
      const startIndex = Math.min(shiftStartIndex.value, lastSelectedRowIndex.value);
      const endIndex = Math.max(shiftStartIndex.value, lastSelectedRowIndex.value);
      _selectRange(startIndex, endIndex, false);
    }
    lastSelectedRowId.value = row.id;
    const currentIndex = row.index;
    const startIndex = Math.min(shiftStartIndex.value, currentIndex);
    const endIndex = Math.max(shiftStartIndex.value, currentIndex);
    _selectRange(startIndex, endIndex, true);
  }

  function onRowClicked(event: MouseEvent, row: Row<TData>) {
    if (event.ctrlKey || event.metaKey) {
      resetShiftStartIndex();
      clickWithCtrl(row);
    } else if (event.shiftKey) {
      clickWithShift(row);
    } else {
      clear();
      select(row.id);
      lastSelectedRowId.value = row.id;
    }
  }

  return {
    rowSelection,
    onRowClicked,
    clear,
  };
}
