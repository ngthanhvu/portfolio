<script setup lang="ts">
import { usePosts } from '~/composables/usePosts'

const route = useRoute()
const { getPostBySlug } = usePosts()

const post = computed(() =>
  getPostBySlug(route.params.slug as string)
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Bài viết không tồn tại'
  })
}

useHead({
  title: post.value
    ? `${post.value.title} | Portfolio`
    : 'Blog'
})

const activeSlug = ref<string>('')

const articleRef = ref<HTMLElement | null>(null)
const tocPanelRef = ref<HTMLElement | null>(null)

const headings = computed(() => {
  if (!post.value?.content) return []

  const matches = [
    ...post.value.content.matchAll(
      /<h([2-4])([^>]*)>(.*?)<\/h[2-4]>/g
    )
  ]

  return matches.map((match, index) => ({
    level: Number(match[1]),
    text: match[3].replace(/<[^>]+>/g, ''),
    id: `heading-${index}`
  }))
})

const processedContent = computed(() => {
  if (!post.value?.content) return ''

  let counter = 0

  return post.value.content.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h([2-4])>/g,
    (_, level, attrs, text) => {
      const id = `heading-${counter++}`

      return `<h${level}${attrs} id="${id}">${text}</h${level}>`
    }
  )
})

function scrollToHeading(id: string) {
  const element = document.getElementById(id)

  if (!element) return

  const offset = 120

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    offset

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: 'smooth'
  })

  activeSlug.value = id
}

let cleanup: (() => void) | undefined

onMounted(() => {
  const article = articleRef.value
  const tocPanel = tocPanelRef.value

  if (
    !article ||
    !tocPanel ||
    headings.value.length === 0
  ) {
    return
  }

  const activeOffset = 160
  const topOffset = 112
  const gutter = 70

  const headingElements = Array.from(
    article.querySelectorAll<HTMLElement>(
      'h2, h3, h4'
    )
  )

  function syncActive() {
    if (!headingElements.length) return

    let candidate = headingElements[0]

    for (const heading of headingElements) {
      const top =
        heading.getBoundingClientRect().top

      if (top - activeOffset <= 0) {
        candidate = heading
      } else {
        break
      }
    }

    if (candidate?.id) {
      activeSlug.value = candidate.id
    }
  }

  function syncPosition() {
    if (!article || !tocPanel) return

    const articleRect =
      article.getBoundingClientRect()

    const articleTop =
      articleRect.top +
      window.scrollY

    const articleRight =
      articleRect.right +
      window.scrollX

    const isFixed =
      window.scrollY + topOffset >=
      articleTop

    if (isFixed) {
      tocPanel.style.position = 'fixed'
      tocPanel.style.top = `${topOffset}px`
      tocPanel.style.left =
        `${articleRight + gutter}px`
    } else {
      tocPanel.style.position = 'absolute'
      tocPanel.style.top = '0px'
      tocPanel.style.left = '0px'
    }
  }

  let ticking = false

  function onFrame() {
    syncActive()
    syncPosition()

    ticking = false
  }

  function onScroll() {
    if (ticking) return

    ticking = true

    window.requestAnimationFrame(
      onFrame
    )
  }

  function onResize() {
    syncPosition()
  }

  window.addEventListener(
    'scroll',
    onScroll,
    { passive: true }
  )

  window.addEventListener(
    'resize',
    onResize
  )

  syncActive()
  syncPosition()

  cleanup = () => {
    window.removeEventListener(
      'scroll',
      onScroll
    )

    window.removeEventListener(
      'resize',
      onResize
    )
  }
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <div class="relative min-h-screen">
    <GridBackground class="h-full w-full" />

    <main class="relative z-30 mx-auto mt-10 max-w-4xl bg-white pb-1 text-neutral-900 md:rounded-t-md">
      <div
        class="relative flex flex-col justify-stretch border-t border-b-0 border-neutral-200 px-5 pt-6 md:rounded-t-2xl md:border-l md:border-r md:pt-20">
        <!-- Side gradient lines -->
        <div
          class="absolute top-0 left-0 mt-1 hidden h-full w-px -translate-x-px bg-linear-to-b from-transparent to-white md:block" />
        <div
          class="absolute top-0 right-0 mt-1 hidden h-full w-px translate-x-px bg-linear-to-b from-transparent to-white md:block" />

        <!-- Header -->
        <div class="mx-auto w-full max-w-2xl px-5 lg:px-0">
          <h1 class="text-3xl font-bold md:mb-8 md:text-4xl lg:text-5xl">
            {{ post?.title }}
          </h1>

          <div class="mb-6 font-semibold text-neutral-500">
            {{ post?.publishedAt }}
            ·

            <NuxtLink to="/" class="hover:underline decoration-dashed underline-offset-4">
              {{ post?.category }}
            </NuxtLink>

            ·

            <span class="inline-flex flex-wrap gap-1">
              <NuxtLink v-for="tag in post?.tags" :key="tag" to="/"
                class="hover:underline decoration-dashed underline-offset-4">
                #{{ tag }}
              </NuxtLink>
            </span>
          </div>

          <!-- TOC -->
          <details v-if="headings.length > 0" class="group mb-10 rounded-xl border border-neutral-200">
            <summary class="flex cursor-pointer select-none items-center justify-between px-4 py-3">
              <span class="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                TABLE OF CONTENT
              </span>

              <span class="text-xs text-neutral-500 group-open:hidden">
                Expand
              </span>

              <span class="hidden text-xs text-neutral-500 group-open:inline">
                Collapse
              </span>
            </summary>

            <nav class="mt-2 space-y-2 px-4 pb-4 text-sm text-neutral-600">
              <button v-for="heading in headings" :key="heading.id" type="button"
                class="block w-full cursor-pointer border-0 bg-transparent p-0 text-left leading-relaxed transition-colors hover:text-neutral-900"
                :class="{
                  'ml-4':
                    heading.level === 2,
                  'ml-10':
                    heading.level >= 3
                }" @click="
                  scrollToHeading(
                    heading.id
                  )
                  ">
                {{ heading.text }}
              </button>
            </nav>
          </details>
        </div>

        <!-- Article -->
        <section class="relative mx-auto w-full max-w-2xl">
          <article ref="articleRef" class="article-content px-7 lg:px-0" v-html="processedContent" />

          <!-- Floating TOC -->
          <aside v-if="headings.length > 0"
            class="pointer-events-none absolute top-0 left-[calc(100%+44px)] hidden w-42.5 xl:block" aria-label="文章目录">
            <div ref="tocPanelRef" class="group/toc pointer-events-auto flex flex-col gap-2"
              style="position: absolute; top: 0; left: 0">
              <button v-for="heading in headings" :key="heading.id" type="button"
                class="group/toc-link relative flex w-full cursor-pointer items-center justify-start border-0 bg-transparent py-1 pr-1 text-left text-xs"
                :title="heading.text" :aria-label="`Jump to ${heading.text}`"
                :aria-current="activeSlug === heading.id ? 'true' : undefined" @click="scrollToHeading(heading.id)">
                <span
                  class="toc-line block h-0.75 rounded-full bg-neutral-300/90 opacity-80 transition-all duration-200 group-hover/toc:opacity-0!"
                  :class="{
                    'w-12': heading.level === 2,
                    'w-8': heading.level >= 3,

                    'is-active': activeSlug === heading.id
                  }" />

                <span
                  class="absolute inset-y-0 left-0 flex items-center pr-4 text-xs text-neutral-500 opacity-0 transition-opacity duration-150 group-hover/toc:opacity-100"
                  :class="{
                    'pl-0': heading.level === 2,
                    'pl-3': heading.level >= 3,

                    'font-semibold text-neutral-900!':
                      activeSlug === heading.id
                  }">
                  <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                    {{ heading.text }}
                  </span>
                </span>
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.article-content :deep(h2) {
  margin-top: 2.5rem;
  margin-bottom: 1rem;

  font-size: 1.5rem;
  font-weight: 700;

  color: var(--color-foreground);
}

.article-content :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;

  font-size: 1.25rem;
  font-weight: 600;

  color: var(--color-foreground);
}

.article-content :deep(h4) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;

  font-size: 1.125rem;
  font-weight: 600;

  color: var(--color-foreground);
}

.article-content :deep(p) {
  margin-bottom: 1.25rem;

  line-height: 1.75;
}

.article-content :deep(a) {
  color: inherit;

  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 4px;
}

.article-content :deep(img) {
  width: 100%;

  margin: 1.5rem 0;

  border-radius: 0.5rem;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1.25rem;

  padding-left: 1.5rem;

  list-style: disc;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;

  line-height: 1.75;
}

.article-content :deep(strong) {
  font-weight: 700;
}

.toc-line.is-active {
  height: 4px;
  background-color: rgb(23 23 23);
  opacity: 1;
}

/*
 * Quan trọng:
 * Khi hover panel, active line cũng phải biến mất.
 */
.group\/toc:hover .toc-line {
  opacity: 0 !important;
}
</style>