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
    class="group relative flex min-w-0 flex-col border border-zinc-800 bg-zinc-950 p-3 transition-colors duration-150 hover:border-zinc-600 hover:bg-zinc-900 sm:p-4"
  >
    <!-- Content -->
    <span class="relative z-30 block">
      <span class="block w-full">
        <img
          :src="project.image"
          :alt="project.name"
          class="aspect-video w-full border border-zinc-800 object-cover"
        />
      </span>
      <span class="mt-4 block w-full px-1">
        <span class="mb-1 flex min-w-0 items-center gap-2 text-[13px] font-bold text-zinc-100">
          <span class="truncate transition-colors group-hover:text-sky-300">{{ project.name }}</span>
          <Icon
            name="lucide:arrow-up-right"
            class="h-3.5 w-3.5 flex-shrink-0 text-zinc-600 transition-colors duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-300"
          />
        </span>
        <span class="block truncate text-[12px] text-zinc-500">
          {{ project.description }}
        </span>
      </span>
    </span>
  </a>
</template>
