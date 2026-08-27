<script setup lang="ts">
import { usePosts } from '~/composables/usePosts'

const route = useRoute()
const { getPostBySlug } = usePosts()

const post = computed(() => getPostBySlug(route.params.slug as string))

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Bài viết không tồn tại'
  })
}

useHead({
  title: post.value ? `${post.value.title} | Portfolio` : 'Blog'
})
</script>

<template>
  <article class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b border-border bg-muted/30 py-12 md:py-20">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-3xl">
          <div class="mb-4 flex items-center gap-3">
            <Badge>{{ post?.category }}</Badge>
            <span class="text-sm text-muted-foreground">{{ post?.readTime }}</span>
          </div>
          <h1 class="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {{ post?.title }}
          </h1>
          <p class="text-lg text-muted-foreground">
            {{ post?.excerpt }}
          </p>
          <div class="mt-6 flex items-center gap-3">
            <img :src="post?.authorAvatar" :alt="post?.author"
              class="h-10 w-10 rounded-full border border-border" />
            <div>
              <p class="text-sm font-medium text-foreground">{{ post?.author }}</p>
              <p class="text-xs text-muted-foreground">{{ post?.publishedAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12 md:px-6">
      <div class="mx-auto max-w-3xl">
        <div class="mb-8 overflow-hidden rounded-lg">
          <img :src="post?.coverImage" :alt="post?.title" class="w-full object-cover" />
        </div>

        <div class="article-content leading-relaxed text-foreground/90" v-html="post?.content" />

        <Separator class="my-8" />

        <!-- Tags -->
        <div class="mb-8">
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="tag in post?.tags" :key="tag" variant="outline">
              {{ tag }}
            </Badge>
          </div>
        </div>

        <!-- Back button -->
        <NuxtLink
          to="/posts"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Icon name="material-symbols:arrow-back" class="h-4 w-4" />
          Quay lại danh sách bài viết
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.article-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-foreground);
}

.article-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}
</style>
