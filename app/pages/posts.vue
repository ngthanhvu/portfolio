<script setup lang="ts">
const { allPosts } = usePosts()

const searchQuery = ref('')
const pageSize = 6
const page = ref(1)

const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return allPosts.value

  const query = searchQuery.value.toLowerCase()
  return allPosts.value.filter((post) => {
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })
})

const displayedPosts = computed(() => {
  return filteredPosts.value.slice(0, page.value * pageSize)
})

const hasMore = computed(() => displayedPosts.value.length < filteredPosts.value.length)

watch(searchQuery, () => {
  page.value = 1
})

const loadMoreRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!loadMoreRef.value) return

  observer = new IntersectionObserver((entries) => {
    const target = entries[0]
    if (target?.isIntersecting && hasMore.value) {
      page.value += 1
    }
  }, {
    rootMargin: '200px',
  })

  observer.observe(loadMoreRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

useHead({
  title: 'Posts | Portfolio',
})
</script>

<template>
  <div class="relative min-h-screen">
    <GridBackground />

    <div class="relative z-20 mx-auto max-w-5xl px-7 pb-12 pt-8 md:pt-12 lg:px-0">
      <h1 class="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
        Posts
      </h1>

      <div class="relative mb-6">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search posts by title or keyword..."
          class="w-full rounded-xl border border-dashed border-neutral-300 bg-white/70 px-4 py-3 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-500"
        />
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
          <Icon name="lucide:search" class="h-4 w-4" />
        </div>
      </div>

      <p class="mb-8 text-sm text-neutral-500">
        {{ filteredPosts.length }} posts
      </p>

      <div class="w-full space-y-7">
        <PostListItem v-for="post in displayedPosts" :key="post.id" :post="post" />
      </div>

      <div
        v-if="filteredPosts.length === 0"
        class="py-12 text-center text-sm text-neutral-500"
      >
        No posts found matching "{{ searchQuery }}".
      </div>

      <div
        v-show="hasMore"
        ref="loadMoreRef"
        class="py-8 text-center text-sm text-neutral-500"
      >
        Loading more posts...
      </div>
    </div>
  </div>
</template>
