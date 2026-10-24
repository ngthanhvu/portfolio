<script setup lang="ts">
import type { BlogPost } from '~/types'

defineProps<{
  featuredPost: BlogPost
}>()
</script>

<template>
  <section class="border-b border-zinc-800 bg-zinc-950/60 py-12 md:py-20">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mb-6 flex items-center gap-3">
        <span class="h-px flex-1 bg-zinc-800" />
        <Badge>Featured post</Badge>
        <span class="h-px flex-1 bg-zinc-800" />
      </div>

      <div class="grid gap-8 lg:grid-cols-2 lg:items-center">
        <NuxtLink
          :to="`/blog/${featuredPost.slug}`"
          class="group relative block aspect-[16/9] overflow-hidden border border-zinc-800 lg:aspect-[4/3]"
        >
          <img
            :src="featuredPost.coverImage"
            :alt="featuredPost.title"
            class="h-full w-full object-cover"
          />
        </NuxtLink>

        <div class="flex flex-col items-start">
          <Badge variant="outline" class="mb-4">{{ featuredPost.category }}</Badge>
          <h1 class="mb-4 text-2xl font-bold tracking-tight text-white md:text-4xl">
            {{ featuredPost.title }}
          </h1>
          <p class="mb-6 text-[13px] text-zinc-500 md:text-sm">
            {{ featuredPost.excerpt }}
          </p>

          <div class="mb-6 flex items-center gap-3">
            <img
              :src="featuredPost.authorAvatar"
              :alt="featuredPost.author"
              class="h-10 w-10 border border-zinc-800 object-cover"
            />
            <div>
              <p class="text-[13px] font-medium text-zinc-200">{{ featuredPost.author }}</p>
              <p class="label-mono text-[11px] text-zinc-500">{{ featuredPost.publishedAt }} / {{ featuredPost.readTime }}</p>
            </div>
          </div>

          <NuxtLink
            :to="`/blog/${featuredPost.slug}`"
            class="label-mono inline-flex h-10 items-center justify-center border border-sky-500/40 bg-sky-500/10 px-6 text-[12px] text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-100 active:bg-sky-500/30"
          >
            Đọc ngay
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
