<script setup lang="ts">
import type { BlogPost } from '~/types'

interface Props {
  post: BlogPost
}

defineProps<Props>()
</script>

<template>
  <NuxtLink :to="`/blog/${post.slug}`" class="group relative block cursor-pointer rounded-2xl p-4 sm:p-6 md:p-7">
    <!-- Background layers for double border hover effect -->
    <span
      class="absolute inset-0 z-20 rounded-2xl border border-dashed border-transparent bg-transparent transition-all duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-neutral-300 group-hover:bg-white" />
    <span
      class="absolute inset-0 z-10 rounded-2xl border border-dashed border-neutral-300 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:translate-y-1" />

    <!-- Content -->
    <span
      class="relative z-30 block transition-transform duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1">
      <span class="flex flex-col gap-4 md:flex-row md:items-start">
        <span class="flex flex-1 flex-col gap-2">
          <span class="flex items-start gap-1">
            <span class="text-lg font-bold leading-tight tracking-tight text-neutral-900 sm:text-xl">
              {{ post.title }}
            </span>
            <Icon name="lucide:arrow-right"
              class="mt-1.5 h-3 w-3 -translate-x-1 text-neutral-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
          <p class="line-clamp-3 text-sm text-neutral-600">
            {{ post.excerpt }}
          </p>
          <span class="mt-1 text-xs font-medium text-neutral-800">
            {{ post.publishedAt }} · {{ post.category }} · #{{ post.tags[0] }}
          </span>
        </span>

        <div class="hidden ml-2 size-32 md:block md:ml-7">
          <img :src="post.coverImage" :alt="post.title" class="aspect-square w-full rounded-xl object-cover" />
        </div>
      </span>
    </span>
  </NuxtLink>
</template>
