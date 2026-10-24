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

    <div class="relative z-20 mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 md:pt-12 lg:px-8">
      <h1 class="mb-4 text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
        Posts
      </h1>

      <div class="relative mb-6">
        <input v-model="searchQuery" type="search" placeholder="Search posts by title or keyword..."
          class="w-full border border-zinc-800 bg-black px-4 py-2.5 pr-10 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400" />
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
          <Icon name="lucide:search" class="h-4 w-4" />
        </div>
      </div>

      <p class="label-mono mb-8 text-[11px] text-zinc-500">
        {{ filteredPosts.length }} posts
      </p>

      <div class="w-full space-y-7">
        <PostListItem v-for="post in displayedPosts" :key="post.id" :post="post" />
      </div>

      <div v-if="filteredPosts.length === 0"
        class="flex flex-col items-center border border-dashed border-border py-12 text-center">
        <span class="label-mono text-[11px] text-zinc-500">
          <template v-if="searchQuery.trim()">
            No posts found matching "{{ searchQuery }}".
          </template>
          <template v-else>
            No posts yet. Check back later!
          </template>
        </span>
      </div>

      <div v-show="hasMore" ref="loadMoreRef" class="label-mono py-8 text-center text-[11px] text-zinc-500">
        Loading more posts...
      </div>
    </div>
  </div>
</template>
