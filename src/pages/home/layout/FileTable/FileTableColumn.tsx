import type { ColumnDef } from "@tanstack/vue-table";

export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

export const columns: ColumnDef<Payment>[] = [
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
