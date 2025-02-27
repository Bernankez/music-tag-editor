<script setup lang="ts">
const appStore = useAppStore();
const { collapsed } = storeToRefs(appStore);

const { t } = useI18n();
</script>

<template>
  <header class="flex items-center justify-between b-0 b-b-1 b-border bg-secondary/50 p-sm">
    <Button class="shrink-0" :title="collapsed ? t('home.sidebar.expand') : t('home.sidebar.collapse')" variant="ghost" size="icon" @click="collapsed = !collapsed">
      <div class="i-ri:side-bar-line"></div>
    </Button>
    <div class="flex items-center gap-sm">
      <Settings>
        <Button class="shrink-0" :title="t('settings.title')" variant="ghost" size="icon">
          <div class="i-ri:settings-4-line"></div>
        </Button>
      </Settings>
      <div class="relative max-w-xs w-full items-center bg-background">
        <Input id="search" type="text" placeholder="Search..." class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <div class="i-ri:search-line text-muted-foreground"></div>
        </span>
      </div>
    </div>
  </header>
</template>
