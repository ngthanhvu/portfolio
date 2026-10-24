<script setup lang="ts">
import type { BlogPost } from '~/types'

interface Props {
  post: BlogPost
}

defineProps<Props>()
</script>

<template>
  <Card class="group transition-colors duration-150 hover:border-zinc-600 hover:bg-zinc-900">
    <NuxtLink :to="`/blog/${post.slug}`" class="block">
      <div class="aspect-video w-full overflow-hidden border-b border-zinc-800 bg-zinc-900">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="h-full w-full object-cover"
        />
      </div>
      <div class="p-5">
        <div class="mb-3 flex items-center gap-2">
          <Badge variant="secondary">{{ post.category }}</Badge>
          <span class="label-mono text-[11px] text-zinc-500">{{ post.readTime }}</span>
        </div>
        <h3 class="mb-2 text-[15px] font-bold leading-tight text-zinc-100 transition-colors group-hover:text-sky-300">
          {{ post.title }}
        </h3>
        <p class="mb-4 line-clamp-2 text-[12.5px] text-zinc-500">
          {{ post.excerpt }}
        </p>
        <div class="label-mono flex items-center gap-2 text-[11px] text-zinc-600">
          <span>{{ post.author }}</span>
          <span>/</span>
          <span>{{ post.publishedAt }}</span>
        </div>
      </div>
    </NuxtLink>
  </Card>
</template>
