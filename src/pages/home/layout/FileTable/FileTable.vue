<script setup lang="ts">
import type { AudioFile } from "./FileTableColumn";
import { useDraggableTableSelection } from "@/composables/useDraggableTableSelection";
import { useFileTableColumn } from "./FileTableColumn";

const tableRef = useTemplateRef("tableRef");
const boundaryRef = useTemplateRef("boundaryRef");

const data = ref<AudioFile[]>([
  {
    id: "teatds",
    filepath: "/users/test/1.mp3",
    size: 1000,
    duration: 1000,
    filename: "1.mp3",
    updateTime: 1000,
    tag: {
      title: "title",
      covers: [],
      artist: "artist",
      album: "album",
      year: "2022",
      track: "1",
      genre: "genre",
      comment: "comment",
    },
  },
  {
    id: "teatds2",
    filepath: "/users/test/2.mp3",
    size: 1000,
    duration: 1000,
    filename: "2.mp3",
    updateTime: 1000,
    tag: {
      title: "title",
      covers: [],
      artist: "artist",
      album: "album",
      year: "2022",
      track: "2",
      genre: "genre",
      comment: "comment",
    },
  },
  {
    id: "teatds3",
    filepath: "/users/test/3.mp3",
    size: 1000,
    duration: 1000,
    filename: "3.mp3",
    updateTime: 1000,
    tag: {
      title: "title",
      covers: [],
      artist: "artist",
      album: "album",
      year: "2022",
      track: "2",
      genre: "genre",
      comment: "comment",
    },
  },
  {
    id: "teatds4",
    filepath: "/users/test/4.mp3",
    size: 1000,
    duration: 1000,
    filename: "4.mp3",
    updateTime: 1000,
    tag: {
      title: "title",
      covers: [],
      artist: "artist",
      album: "album",
      year: "2022",
      track: "2",
      genre: "genre",
      comment: "comment",
    },
  },
  {
    id: "teatds5",
    filepath: "/users/test/5.mp3",
    size: 1000,
    duration: 1000,
    filename: "5.mp3",
    updateTime: 1000,
    tag: {
      title: "title",
      covers: [],
      artist: "artist",
      album: "album",
      year: "2022",
      track: "2",
      genre: "genre",
      comment: "comment",
    },
  },
  {
    id: "teatds6",
    filepath: "/users/test/6.mp3",
    size: 1000,
    duration: 1000,
    filename: "6.mp3",
    updateTime: 1000,
    tag: {
      title: "title",
      covers: [],
      artist: "artist",
      album: "album",
      year: "2022",
      track: "2",
      genre: "genre",
      comment: "comment",
    },
  },
]);

const { columns } = useFileTableColumn();

const { handleMouseDown, handleClickBlank } = useDraggableTableSelection({
  tableRef,
  boundaryRef,
});
</script>

<template>
  <div
    ref="boundaryRef"
    class="relative min-h-full min-w-full overflow-auto pb-sm"
    @click="handleClickBlank"
    @mousedown="handleMouseDown"
  >
    <MiniTable ref="tableRef" :columns :data @click.stop />
  </div>
</template>
