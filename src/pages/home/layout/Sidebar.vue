<script setup lang="ts">
import { FormField } from "@/components/ui/form";

const { t } = useI18n();
</script>

<template>
  <aside class="h-full overflow-y-auto bg-secondary p-sm text-secondary-foreground">
    <form class="grid grid-cols-4 gap-sm">
      <FormField v-slot="{ componentField }" name="title">
        <FormItem class="col-span-4">
          <FormLabel class="select-none">
            {{ t("audio.tag.title.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="artist">
        <FormItem class="col-span-4">
          <FormLabel class="select-none">
            {{ t("audio.tag.artist.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="album">
        <FormItem class="col-span-4">
          <FormLabel class="select-none">
            {{ t("audio.tag.album.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="year">
        <FormItem>
          <FormLabel class="select-none">
            {{ t("audio.tag.year.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="track">
        <FormItem>
          <FormLabel class="select-none">
            {{ t("audio.tag.track.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="genre">
        <FormItem class="col-span-2">
          <FormLabel class="select-none">
            {{ t("audio.tag.genre.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="comment">
        <FormItem class="col-span-4">
          <FormLabel class="select-none">
            {{ t("audio.tag.comment.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="albumArtist">
        <FormItem class="col-span-4">
          <FormLabel class="select-none">
            {{ t("audio.tag.albumArtist.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="composer">
        <FormItem class="col-span-4">
          <FormLabel class="select-none">
            {{ t("audio.tag.composer.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="discNumber">
        <FormItem class="col-span-2">
          <FormLabel class="select-none">
            {{ t("audio.tag.discNumber.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="compilation">
        <FormItem class="col-span-2">
          <FormLabel class="select-none">
            {{ t("audio.tag.compilation.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="covers">
        <FormItem class="col-span-4">
          <FormLabel class="select-none">
            {{ t("audio.tag.covers.title") }}
          </FormLabel>
          <FormControl>
            <Input v-bind="componentField" class="bg-background" />
          </FormControl>
        </FormItem>
      </FormField>
    </form>
  </aside>
</template>
