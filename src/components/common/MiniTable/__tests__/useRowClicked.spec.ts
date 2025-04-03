import type { Row } from "@tanstack/vue-table";
import { beforeEach, describe, expect, it } from "vitest";
import { useRowClicked } from "../useRowClicked";

function createMockRow(id: string, index: number) {
  return {
    id,
    index,
  } as Row<any>;
}

function createMockMouseEvent(options: {
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}) {
  return {
    ctrlKey: options.ctrlKey || false,
    metaKey: options.metaKey || false,
    shiftKey: options.shiftKey || false,
  } as MouseEvent;
}

describe("useRowClicked", () => {
  const rowIds = ref(["row1", "row2", "row3", "row4", "row5"]);
  let rowClickedUtils: ReturnType<typeof useRowClicked<any>>;
  const clickEvent = createMockMouseEvent({});
  const clickEventWithCtrl = createMockMouseEvent({ ctrlKey: true });
  const clickEventWithShift = createMockMouseEvent({ shiftKey: true });

  beforeEach(() => {
    rowClickedUtils = useRowClicked(rowIds);
  });

  it("should select row1", () => {
    const row = createMockRow("row1", 0);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true });
  });

  it("should keep select when click the same row twice", () => {
    const row = createMockRow("row1", 0);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row);
    // click row1 again
    rowClickedUtils.onRowClicked(clickEvent, row);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true });
  });

  it("should unselect when click a selected row with ctrl", () => {
    const row = createMockRow("row1", 0);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row);
    // click row1 with ctrl
    rowClickedUtils.onRowClicked(clickEventWithCtrl, row);
    expect(rowClickedUtils.rowSelection).toEqual({});
  });

  it("should multi select when click different rows with ctrl", () => {
    const row1 = createMockRow("row1", 0);
    const row2 = createMockRow("row2", 1);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row1);
    // click row2 with ctrl
    rowClickedUtils.onRowClicked(clickEventWithCtrl, row2);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true, row2: true });
  });

  it("should select a range when click a selected row with shift", () => {
    const row1 = createMockRow("row1", 0);
    const row3 = createMockRow("row3", 2);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row1);
    // click row3 with shift
    rowClickedUtils.onRowClicked(clickEventWithShift, row3);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true, row2: true, row3: true });
  });

  it("should select a range when no row selected", () => {
    const row3 = createMockRow("row3", 2);
    // click row3 with shift
    rowClickedUtils.onRowClicked(clickEventWithShift, row3);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true, row2: true, row3: true });
  });

  it("should select correct range when click with shift", () => {
    const row1 = createMockRow("row1", 0);
    const row3 = createMockRow("row3", 2);
    const row5 = createMockRow("row5", 4);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row1);
    // click row5 with ctrl
    rowClickedUtils.onRowClicked(clickEventWithCtrl, row5);
    // click row3 with shift
    rowClickedUtils.onRowClicked(clickEventWithShift, row3);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true, row3: true, row4: true, row5: true });
  });

  it("should select correct range with shift and ctrl", () => {
    const row1 = createMockRow("row1", 0);
    const row2 = createMockRow("row2", 1);
    const row3 = createMockRow("row3", 2);
    const row5 = createMockRow("row5", 4);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row1);
    // click row3 with ctrl
    rowClickedUtils.onRowClicked(clickEventWithCtrl, row3);
    // click row5 with ctrl
    rowClickedUtils.onRowClicked(clickEventWithCtrl, row5);
    // click row2 with shift
    rowClickedUtils.onRowClicked(clickEventWithShift, row2);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true, row2: true, row3: true, row4: true, row5: true });
    // click row3 with shift
    rowClickedUtils.onRowClicked(clickEventWithShift, row3);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true, row3: true, row4: true, row5: true });
  });

  it("should clear when click clear", () => {
    const row1 = createMockRow("row1", 0);
    const row2 = createMockRow("row2", 1);
    // click row1
    rowClickedUtils.onRowClicked(clickEvent, row1);
    // click row2
    rowClickedUtils.onRowClicked(clickEvent, row2);
    // clear
    rowClickedUtils.clear();
    expect(rowClickedUtils.rowSelection).toEqual({});
  });

  it("should remove last selected row when clear", () => {
    const row1 = createMockRow("row1", 0);
    const row4 = createMockRow("row4", 3);
    const row5 = createMockRow("row5", 4);
    // click row4
    rowClickedUtils.onRowClicked(clickEvent, row4);
    // click row5 with shift
    rowClickedUtils.onRowClicked(clickEventWithShift, row5);
    expect(rowClickedUtils.rowSelection).toEqual({ row4: true, row5: true });
    rowClickedUtils.clear();
    expect(rowClickedUtils.rowSelection).toEqual({});
    rowClickedUtils.onRowClicked(clickEvent, row1);
    rowClickedUtils.onRowClicked(clickEventWithShift, row4);
    expect(rowClickedUtils.rowSelection).toEqual({ row1: true, row2: true, row3: true, row4: true });
  });
});
