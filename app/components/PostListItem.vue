<script setup lang="ts">
import type { BlogPost } from '~/types'

interface Props {
  post: BlogPost
}

defineProps<Props>()
</script>

<template>
  <NuxtLink :to="`/blog/${post.slug}`"
    class="group relative block border border-zinc-800 bg-zinc-950 p-4 transition-colors duration-150 hover:border-zinc-600 hover:bg-zinc-900 sm:p-6">
    <!-- Content -->
    <span class="relative z-30 block">
      <span class="flex flex-col gap-4 md:flex-row md:items-start">
        <span class="flex flex-1 flex-col gap-2">
          <span class="flex items-start gap-1">
            <span
              class="text-[15px] font-bold leading-tight text-zinc-100 transition-colors group-hover:text-sky-300 sm:text-base">
              {{ post.title }}
            </span>
            <Icon name="lucide:arrow-right"
              class="mt-1 h-3.5 w-3.5 -translate-x-1 text-zinc-600 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
          <p class="line-clamp-3 text-[12.5px] text-zinc-500">
            {{ post.excerpt }}
          </p>
          <span class="label-mono mt-1 text-[11px] text-zinc-600">
            {{ post.publishedAt }} / {{ post.category }} / #{{ post.tags[0] }}
          </span>
        </span>

        <div class="hidden ml-2 size-32 md:block md:ml-7">
          <img :src="post.coverImage" :alt="post.title"
            class="aspect-square w-full border border-zinc-800 object-cover" />
        </div>
      </span>
    </span>
  </NuxtLink>
</template>
