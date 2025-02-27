<script setup lang="ts">
import { FormField } from "@/components/ui/form";
</script>

<template>
  <aside class="h-full bg-secondary">
    <form>
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormLabel>标题</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="artist">
        <FormItem>
          <FormLabel>艺术家</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="album">
        <FormItem>
          <FormLabel>专辑</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
    </form>
  </aside>
</template>
