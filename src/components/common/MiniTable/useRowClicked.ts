import type { Row } from "@tanstack/vue-table";

export function useRowClicked<TData>(rowIds: MaybeRefOrGetter<string[]>) {
  // Record<id, string>
  const rowSelection = reactive<Record<string, boolean>>({});
  const lastSelectedRowId = shallowRef<string>();
  const lastSelectedRowIndex = computed(() => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length === 0) {
      return -1;
    } else if (selectedIds.length === 1) {
      return toValue(rowIds).indexOf(selectedIds[0]);
    } else if (isDefined(lastSelectedRowId.value)) {
      return toValue(rowIds).indexOf(lastSelectedRowId.value);
    }
    return -1;
  });

  function isSelected(id: string) {
    return !!rowSelection[id];
  }

  function clear() {
    Object.keys(rowSelection).forEach((key) => {
      unselect(key);
    });
  }

  function select(id: string) {
    if (isSelected(id)) {
      return;
    }
    rowSelection[id] = true;
    lastSelectedRowId.value = id;
  }

  function unselect(id: string) {
    if (!isSelected(id)) {
      return;
    }
    delete rowSelection[id];
  }

  function toggle(id: string) {
    if (isSelected(id)) {
      unselect(id);
    } else {
      select(id);
    }
  }

  function onRowClicked(event: MouseEvent, row: Row<TData>) {
    if (event.ctrlKey || event.metaKey) {
      toggle(row.id);
    } else if (event.shiftKey) {
    } else {
    }
  }

  return {
    rowSelection,
  };
}
