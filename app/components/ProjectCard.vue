<script setup lang="ts">
import type { Project } from '~/types'

interface Props {
  project: Project
}

defineProps<Props>()
</script>

<template>
  <a
    :href="project.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative flex flex-col rounded-2xl p-3 sm:p-7"
  >
    <!-- Background layers for double border hover effect -->
    <span class="absolute inset-0 z-20 rounded-2xl border border-dashed border-transparent bg-transparent transition-all duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-neutral-300 group-hover:bg-white" />
    <span class="absolute inset-0 z-10 rounded-2xl border border-dashed border-neutral-300 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:translate-y-1" />

    <!-- Content -->
    <span class="relative z-30 block transition-transform duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1">
      <span class="block w-full">
        <img
          :src="project.image"
          :alt="project.name"
          class="aspect-video w-full rounded-lg object-cover"
        />
      </span>
      <span class="mt-3 block w-full px-1 sm:mt-5">
        <span class="mb-1 flex items-center gap-1 text-base font-semibold tracking-tight text-neutral-900">
          <span>{{ project.name }}</span>
          <Icon
            name="lucide:arrow-up-right"
            class="h-3 w-3 -rotate-45 text-neutral-400 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0"
          />
        </span>
        <span class="block truncate text-sm text-neutral-600">
          {{ project.description }}
        </span>
      </span>
    </span>
  </a>
</template>
