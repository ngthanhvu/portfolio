<script setup lang="ts">
import type { BlogPost } from '~/types'

defineProps<{
  featuredPost: BlogPost
}>()
</script>

<template>
  <section class="border-b border-border bg-muted/30 py-12 md:py-20">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mb-6 flex items-center gap-3">
        <span class="h-px flex-1 bg-border" />
        <Badge>Featured post</Badge>
        <span class="h-px flex-1 bg-border" />
      </div>

      <div class="grid gap-8 lg:grid-cols-2 lg:items-center">
        <NuxtLink
          :to="`/blog/${featuredPost.slug}`"
          class="group relative block aspect-[16/9] overflow-hidden rounded-lg lg:aspect-[4/3]"
        >
          <img
            :src="featuredPost.coverImage"
            :alt="featuredPost.title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </NuxtLink>

        <div class="flex flex-col items-start">
          <Badge variant="outline" class="mb-4">{{ featuredPost.category }}</Badge>
          <h1 class="mb-4 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            {{ featuredPost.title }}
          </h1>
          <p class="mb-6 text-base text-muted-foreground md:text-lg">
            {{ featuredPost.excerpt }}
          </p>

          <div class="mb-6 flex items-center gap-3">
            <img
              :src="featuredPost.authorAvatar"
              :alt="featuredPost.author"
              class="h-10 w-10 rounded-full border border-border"
            />
            <div>
              <p class="text-sm font-medium text-foreground">{{ featuredPost.author }}</p>
              <p class="text-xs text-muted-foreground">{{ featuredPost.publishedAt }} · {{ featuredPost.readTime }}</p>
            </div>
          </div>

          <NuxtLink
            :to="`/blog/${featuredPost.slug}`"
            class="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Đọc ngay
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
