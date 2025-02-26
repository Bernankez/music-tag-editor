export function useDisplayDirective(show: MaybeRefOrGetter<boolean>, directive: MaybeRefOrGetter<"if" | "show"> = "if") {
  const showValue = computed(() => toValue(directive) === "show" ? toValue(show) : true);
  const ifValue = computed(() => toValue(directive) === "if" ? toValue(show) : true);

  return {
    showValue,
    ifValue,
  };
}
