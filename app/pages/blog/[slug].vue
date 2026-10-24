<script setup lang="ts">
import { marked } from 'marked'
import { usePosts } from '~/composables/usePosts'

const route = useRoute()
const { getPostBySlug } = usePosts()

const { data: post, error } = await useAsyncData(
  `post-${route.params.slug}`,
  () => getPostBySlug(route.params.slug as string)
)

if (error.value || !post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Bài viết không tồn tại'
  })
}

useHead({
  title: post.value
    ? `${post.value.title}`
    : 'Blog'
})

const activeSlug = ref<string>('')

const articleRef = ref<HTMLElement | null>(null)
const tocPanelRef = ref<HTMLElement | null>(null)

const parsedHtml = computed(() => {
  if (!post.value?.content) return ''
  const content = post.value.content

  // Normalize TipTap-wrapped markdown lines (<p># ...</p>, <p>## ...</p>, etc.)
  const normalized = content
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/^<p>|<\/p>$/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')

  return (marked.parse(normalized, { async: false }) as string) || ''
})

const headings = computed(() => {
  if (!parsedHtml.value) return []

  const matches = [
    ...parsedHtml.value.matchAll(
      /<h([1-4])([^>]*)>(.*?)<\/h[1-4]>/g
    )
  ]

  return matches.map((match, index) => ({
    level: Number(match[1]),
    text: (match[3] ?? '').replace(/<[^>]+>/g, ''),
    id: `heading-${index}`
  }))
})

const processedContent = computed(() => {
  if (!parsedHtml.value) return ''

  let counter = 0

  return parsedHtml.value.replace(
    /<h([1-4])([^>]*)>(.*?)<\/h([1-4])>/g,
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
      'h1, h2, h3, h4'
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

    <main class="relative z-30 mx-auto max-w-4xl border-x border-zinc-800 bg-zinc-950 px-5 pt-10 pb-16 text-zinc-200 sm:px-8 sm:pt-14 md:pt-16">
      <div class="mx-auto w-full max-w-2xl">
        <h1 class="mb-4 text-3xl font-bold uppercase tracking-tight text-white sm:mb-6 md:text-4xl lg:text-5xl">
          {{ post?.title }}
        </h1>
        <div class="label-mono mb-8 border-b border-zinc-800/80 pb-6 text-[11px] text-zinc-500">
          {{ post?.publishedAt }}
          /
          <NuxtLink to="/" class="underline underline-offset-4 hover:text-sky-300">
            {{ post?.category }}
          </NuxtLink>
          /
          <span class="inline-flex flex-wrap gap-1">
            <NuxtLink v-for="tag in post?.tags" :key="tag" to="/"
              class="underline underline-offset-4 hover:text-sky-300">
              #{{ tag }}
            </NuxtLink>
          </span>
        </div>

        <!-- TOC -->
        <details v-if="headings.length > 0" class="group mb-10 border border-zinc-800 bg-black">
          <summary class="flex cursor-pointer select-none items-center justify-between px-4 py-3">
            <span class="label-mono text-[11px] text-zinc-300">
              TABLE OF CONTENT
            </span>

            <span class="label-mono text-[11px] text-zinc-600 group-open:hidden">
              Expand
            </span>

            <span class="label-mono hidden text-[11px] text-zinc-600 group-open:inline">
              Collapse
            </span>
          </summary>

          <nav class="mt-2 space-y-2 border-t border-zinc-800 px-4 py-4 text-[12px] text-zinc-500">
            <button v-for="heading in headings" :key="heading.id" type="button"
              class="block w-full cursor-pointer border-0 bg-transparent p-0 text-left leading-relaxed transition-colors hover:text-zinc-100"
              :class="{
                'font-semibold text-zinc-200': heading.level === 1,
                'ml-3': heading.level === 2,
                'ml-7 text-zinc-400': heading.level === 3,
                'ml-11 text-zinc-500': heading.level >= 4
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
        <article ref="articleRef" class="article-content" v-html="processedContent" />

        <!-- Floating TOC -->
        <aside v-if="headings.length > 0"
          class="pointer-events-none absolute top-0 left-[calc(100%+44px)] hidden w-42.5 xl:block" aria-label="Table of Contents">
          <div ref="tocPanelRef" class="group/toc pointer-events-auto flex flex-col gap-2"
            style="position: absolute; top: 0; left: 0">
            <button v-for="heading in headings" :key="heading.id" type="button"
              class="group/toc-link relative flex w-full cursor-pointer items-center justify-start border-0 bg-transparent py-1 pr-1 text-left text-xs"
              :title="heading.text" :aria-label="`Jump to ${heading.text}`"
              :aria-current="activeSlug === heading.id ? 'true' : undefined" @click="scrollToHeading(heading.id)">
              <span
                class="toc-line block h-0.75 bg-zinc-600 opacity-80 transition-all duration-150 group-hover/toc:opacity-0!"
                :class="{
                  'w-16': heading.level === 1,
                  'w-12': heading.level === 2,
                  'w-8': heading.level >= 3,
                  'is-active': activeSlug === heading.id
                }" />

              <span
                class="absolute inset-y-0 left-0 flex items-center pr-4 text-[11px] text-zinc-600 opacity-0 transition-opacity duration-150 group-hover/toc:opacity-100"
                :class="{
                  'pl-0 font-medium': heading.level <= 2,
                  'pl-3': heading.level >= 3,
                  'font-semibold text-zinc-100!':
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

      <!-- Comments -->
      <section class="relative mx-auto w-full max-w-2xl pb-16">
        <CommentSection v-if="post" :post-id="Number(post.id)" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.article-content :deep(h1) {
  margin-top: 2.75rem;
  margin-bottom: 1.25rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #f4f4f5;
  border-bottom: 1px solid #27272a;
  padding-bottom: 0.5rem;
}

.article-content :deep(h2) {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.375rem;
  font-weight: 700;
  color: #e4e4e7;
  border-bottom: 1px solid #27272a;
  padding-bottom: 0.35rem;
}

.article-content :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #d4d4d8;
}

.article-content :deep(h4) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #d4d4d8;
}

.article-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.article-content :deep(a) {
  color: #7dd3fc;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.article-content :deep(a:hover) {
  color: #bae6fd;
}

.article-content :deep(img) {
  width: 100%;
  margin: 1.5rem 0;
  border: 1px solid #373e4b;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.article-content :deep(ul) {
  list-style: disc;
}

.article-content :deep(ol) {
  list-style: decimal;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.75;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: #fafafa;
}

.article-content :deep(pre) {
  background: #1a1e25;
  border: 1px solid #373e4b;
  padding: 0.85rem 1rem;
  overflow-x: auto;
  margin: 1rem 0 1.5rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.825rem;
  line-height: 1.6;
}

.article-content :deep(code) {
  background: #2b303c;
  border: 1px solid #373e4b;
  padding: 0.1rem 0.35rem;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #38bdf8;
}

.article-content :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
  color: #e2e8f0;
}

.article-content :deep(blockquote) {
  border-left: 3px solid #38bdf8;
  padding-left: 1rem;
  color: #8791a0;
  margin: 1.25rem 0;
  font-style: italic;
  background: rgba(56, 189, 248, 0.03);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.85rem;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid #373e4b;
  padding: 0.6rem 0.75rem;
  text-align: left;
}

.article-content :deep(th) {
  background: #22262f;
  font-weight: 600;
  color: #e4e4e7;
}

.article-content :deep(tr:nth-child(even)) {
  background: rgba(255, 255, 255, 0.02);
}

.article-content :deep(hr) {
  border: none;
  border-top: 1px solid #27272a;
  margin: 2.5rem 0;
}

.toc-line.is-active {
  height: 4px;
  background-color: #38bdf8;
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