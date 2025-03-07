import type { ColumnDef } from "@tanstack/vue-table";

export interface AudioTag {
  title: string;
  artist: string;
  album: string;
  year: string;
  track: string;
  comment: string;
  genre: string;
  covers: string[];
}

export interface AudioFile {
  id: string;
  filepath: string;
  filename: string;
  size: number;
  duration: number;
  updateTime: number;
  tag: AudioTag;
}

export function useFileTableColumn() {
  const { t } = useI18n();

  const columns = computed<ColumnDef<AudioFile>[]>(() => [
    {
      accessorKey: "filename",
      header: () => <div>{ t("audio.filename.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue("filename") }</div>;
      },
    },
    {
      accessorKey: "filepath",
      header: () => <div>{ t("audio.filepath.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue("filepath") }</div>;
      },
    },
    {
      accessorKey: "tag.title",
      header: () => <div>{ t("audio.tag.title.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue<AudioTag>("tag_title") }</div>;
      },
    },
    {
      accessorKey: "tag.artist",
      header: () => <div>{ t("audio.tag.artist.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue<AudioTag>("tag_artist") }</div>;
      },
    },
    {
      accessorKey: "tag.album",
      header: () => <div>{ t("audio.tag.album.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue<AudioTag>("tag_album") }</div>;
      },
    },
    {
      accessorKey: "tag.year",
      header: () => <div>{ t("audio.tag.year.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue<AudioTag>("tag_year") }</div>;
      },
    },
    {
      accessorKey: "tag.comment",
      header: () => <div>{ t("audio.tag.comment.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue<AudioTag>("tag_comment") }</div>;
      },
    },
    {
      accessorKey: "duration",
      header: () => <div>{ t("audio.duration.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue("duration") }</div>;
      },
    },
    {
      accessorKey: "size",
      header: () => <div>{ t("audio.size.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue("size") }</div>;
      },
    },
    {
      accessorKey: "updateTime",
      header: () => <div>{ t("audio.updateTime.title") }</div>,
      cell: ({ row }) => {
        return <div class="font-medium">{ row.getValue("updateTime") }</div>;
      },
    },
  ]);

  return {
    columns,
  };
}

export const columns: ColumnDef<AudioTag>[] = [
  {
    accessorKey: "id",
    header: () => <div class="text-right">Id</div>,
    cell: ({ row }) => {
      return <div class="text-right font-medium">{ row.id }</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div class="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div class="text-right font-medium">{ formatted }</div>;
    },
  },
];
