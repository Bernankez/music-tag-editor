<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef, Row } from "@tanstack/vue-table";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { noop } from "@vueuse/core";

const { columns = [], data = [], getRowId } = defineProps<{
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  getRowId?: (originalRow: TData) => string;
}>();

const rowSelection = reactive<Record<string, boolean>>({});
const lastClickedRow = shallowRef<Row<TData>>();
function clearSelection() {
  Object.keys(rowSelection).forEach((key) => {
    delete rowSelection[key];
  });
  lastClickedRow.value = undefined;
}

function onRowClicked(row: Row<TData>, event: MouseEvent) {
  if (event.ctrlKey || event.metaKey) {
    rowSelection[row.id] = true;
  } else if (event.shiftKey) {
    const lastClickedIndex = lastClickedRow.value?.index ?? 0;
    const currentIndex = row.index;
    const startIndex = Math.min(lastClickedIndex, currentIndex);
    const endIndex = Math.max(lastClickedIndex, currentIndex);
    const rowIds = data.map((originalRow, index) => {
      if (getRowId) {
        return getRowId(originalRow);
      }
      return index.toString();
    });
    for (let i = startIndex; i <= endIndex; i++) {
      rowSelection[rowIds[i]] = true;
    }
  } else {
    clearSelection();
    rowSelection[row.id] = true;
  }
  lastClickedRow.value = row;
}

const table = useVueTable({
  get data() {
    return data;
  },
  get columns() {
    return columns;
  },
  columnResizeMode: "onChange",
  columnResizeDirection: "ltr",
  getRowId,
  getCoreRowModel: getCoreRowModel(),
  onRowSelectionChange: noop,
  state: {
    rowSelection,
  },
});

defineExpose({
  clearSelection,
});
</script>

<template>
  <Table :style="{ width: `${table.getCenterTotalSize()}px` }">
    <TableHeader>
      <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <TableHead v-for="(header, i) in headerGroup.headers" :key="header.id" :col-span="header.colSpan" :style="{ width: `${header.getSize()}px` }" class="relative select-none">
          <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
          <div class="resizer absolute top-0 h-full w-px touch-none select-none bg-border hover:cursor-col-resize" :class="[table.options.columnResizeDirection === 'ltr' ? 'right-0' : 'left-0', i === headerGroup.headers.length - 1 && 'overflow-hidden']" @dblclick="header.column.resetSize" @mousedown="header.getResizeHandler()($event)" @touchstart="header.getResizeHandler()($event)"></div>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="table.getRowModel().rows.length">
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() ? 'selected' : undefined" class="cursor-default select-none" @click="onRowClicked(row, $event)">
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :style="{ width: `${cell.column.getSize()}px` }" :class="[row.getIsSelected() ? 'bg-primary text-primary-foreground' : '']">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colspan="columns.length" />
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>

<style scoped>
.resizer::before,
.resizer::after {
  content: "";
  z-index: 1;
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
}

.resizer::before {
  right: 0;
}

.resizer::after {
  left: 0;
}
</style>
