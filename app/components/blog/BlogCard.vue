<script setup lang="ts">
import type { BlogPost } from '~/types'

interface Props {
  post: BlogPost
}

defineProps<Props>()
</script>

<template>
  <Card class="group">
    <NuxtLink :to="`/blog/${post.slug}`" class="block">
      <div class="aspect-video w-full overflow-hidden bg-muted">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div class="p-5">
        <div class="mb-3 flex items-center gap-2">
          <Badge variant="secondary">{{ post.category }}</Badge>
          <span class="text-xs text-muted-foreground">{{ post.readTime }}</span>
        </div>
        <h3 class="mb-2 text-lg font-semibold leading-tight text-card-foreground group-hover:text-muted-foreground">
          {{ post.title }}
        </h3>
        <p class="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {{ post.excerpt }}
        </p>
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{{ post.author }}</span>
          <span>&bull;</span>
          <span>{{ post.publishedAt }}</span>
        </div>
      </div>
    </NuxtLink>
  </Card>
</template>
