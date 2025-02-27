<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from "@tanstack/vue-table";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";

const { columns = [], data = [] } = defineProps<{
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
}>();

const table = useVueTable({
  get data() {
    return data;
  },
  get columns() {
    return columns;
  },
  columnResizeMode: "onChange",
  columnResizeDirection: "ltr",
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <div>
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id" :col-span="header.colSpan" :style="{ width: header.getSize() }">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            <!-- <div class="resizer h-5 w-1 bg-black" :style="{ transform: header.column.getIsResizing() ? `translateX(${table.getState().columnSizingInfo.deltaOffset ?? 0})` : '' }" @doubleclick="() => header.column.resetSize()" @mousedown="header.getResizeHandler()" @touchstart="header.getResizeHandler()"></div> -->
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() ? 'selected' : undefined">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
