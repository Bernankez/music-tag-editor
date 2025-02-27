export function useTheme() {
  const { store } = useColorMode();
  const { state, next } = useCycleList(["auto", "light", "dark"] as const, { initialValue: store });

  watchEffect(() => {
    store.value = state.value;
  });

  return {
    theme: state,
    toggle: next,
  };
}
