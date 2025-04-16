import type { InjectionKey, Ref } from "vue";

export { default as Segment } from "./Segment.vue";
export { default as SegmentTab } from "./SegmentTab.vue";

export const RegisterValueKey: InjectionKey<(value: string) => void> = Symbol(
  "SegmentRegisterValue",
);

export const CurrentValueKey: InjectionKey<Ref<string | undefined>> = Symbol(
  "SegmentCurrentValue",
);

export const UpdateValueKey: InjectionKey<(value: string) => void> = Symbol(
  "SegmentUpdateValue",
);

// Key for registering/unregistering tab elements
export const SegmentRegisterElementKey: InjectionKey<
  (value: string, el: HTMLElement | null) => void
> = Symbol("SegmentRegisterElement");
