<script setup lang="ts">
import { FormField } from "@/components/ui/form";

const { t } = useI18n();
</script>

<template>
  <aside class="h-full overflow-y-auto bg-secondary p-sm">
    <form class="grid grid-cols-4 gap-sm">
      <FormField v-slot="{ componentField }" name="title">
        <FormItem class="col-span-4">
          <FormLabel>{{ t("home.sidebar.title.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="artist">
        <FormItem class="col-span-4">
          <FormLabel>{{ t("home.sidebar.artist.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="album">
        <FormItem class="col-span-4">
          <FormLabel>{{ t("home.sidebar.album.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="year">
        <FormItem>
          <FormLabel>{{ t("home.sidebar.year.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="track">
        <FormItem>
          <FormLabel>{{ t("home.sidebar.track.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="genre">
        <FormItem class="col-span-2">
          <FormLabel>{{ t("home.sidebar.genre.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="comment">
        <FormItem class="col-span-4">
          <FormLabel>{{ t("home.sidebar.comment.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="albumArtist">
        <FormItem class="col-span-4">
          <FormLabel>{{ t("home.sidebar.albumArtist.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="composer">
        <FormItem class="col-span-4">
          <FormLabel>{{ t("home.sidebar.composer.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="discNumber">
        <FormItem class="col-span-2">
          <FormLabel>{{ t("home.sidebar.discNumber.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="compilation">
        <FormItem class="col-span-2">
          <FormLabel>{{ t("home.sidebar.compilation.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="covers">
        <FormItem class="col-span-4">
          <FormLabel>{{ t("home.sidebar.covers.title") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
    </form>
  </aside>
</template>
