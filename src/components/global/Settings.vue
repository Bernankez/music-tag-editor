<script setup lang="ts">
import type { AvailableLocales } from "~/src/utils/i18n";
import { FormField } from "@/components/ui/form";
import { useTheme } from "~/src/composables/useTheme";

const { t, locale } = useI18n();
const router = useRouter();

const settingsStore = useSettingsStore();
const { usePointerCursor } = storeToRefs(settingsStore);

const { theme } = useTheme();

const options = computed(() => {
  return availableLocales.map((locale) => {
    let label: string;
    switch (locale) {
      case "en-US":
        label = "English";
        break;
      case "zh-CN":
        label = "简体中文";
        break;
    }
    return {
      label,
      value: locale,
    };
  });
});

async function switchLocale(val: AvailableLocales) {
  await setLocale(val);
  try {
    await router.replace({ params: { locale: val } });
  } catch (error) {
    console.error(error);
    router.push("/");
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ t('settings.title') }}</DialogTitle>
      </DialogHeader>
      <div>
        <FormField name="cursor">
          <FormItem class="flex items-center justify-between">
            <div>
              <FormLabel>{{ t('settings.cursor.title') }}</FormLabel>
              <FormDescription>{{ t('settings.cursor.description') }}</FormDescription>
            </div>
            <FormControl>
              <Switch v-model="usePointerCursor" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="theme">
          <FormItem class="flex items-center justify-between">
            <div>
              <FormLabel>{{ t('settings.theme.title') }}</FormLabel>
            </div>
            <FormControl>
              <Segment v-model="theme">
                <SegmentTab value="auto">
                  <div class="flex items-center gap-1">
                    <div class="i-ri:computer-line text-xs"></div>
                    {{ t('settings.theme.system') }}
                  </div>
                </SegmentTab>
                <SegmentTab value="light">
                  <div class="flex items-center gap-1">
                    <div class="i-ri:sun-line text-xs"></div>
                    {{ t('settings.theme.light') }}
                  </div>
                </SegmentTab>
                <SegmentTab value="dark">
                  <div class="flex items-center gap-1">
                    <div class="i-ri:moon-line text-xs"></div>
                    {{ t('settings.theme.dark') }}
                  </div>
                </SegmentTab>
              </Segment>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="language">
          <FormItem class="flex items-center justify-between">
            <div>
              <FormLabel>{{ t('settings.language.title') }}</FormLabel>
            </div>
            <FormControl>
              <Select :model-value="locale" @update:model-value="value => switchLocale(value as AvailableLocales)">
                <SelectTrigger class="w-50">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="lang in options" :key="lang.value" :value="lang.value">
                    {{ lang.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      <!-- <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter> -->
    </DialogContent>
  </Dialog>
</template>
