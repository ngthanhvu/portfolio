<script setup lang="ts">
import { about } from '~/data/abouts'

useHead({
  title: `${about.title} | Portfolio`,
})

const activeSlug = ref<string>('')
const articleRef = ref<HTMLElement | null>(null)
const tocPanelRef = ref<HTMLElement | null>(null)

const headings = computed(() => {
  const matches = [...about.content.matchAll(/<h([2-4])([^>]*)>(.*?)<\/h[2-4]>/g)]
  return matches.map((match, index) => ({
    level: Number(match[1]),
    text: (match[3] ?? '').replace(/<[^>]+>/g, ''),
    id: `heading-${index}`,
  }))
})

const processedContent = computed(() => {
  let counter = 0
  return about.content.replace(/<h([2-4])([^>]*)>(.*?)<\/h([2-4])>/g, (_, level, attrs, text) => {
    const id = `heading-${counter++}`
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`
  })
})

function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  const offset = 120
  const top = element.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
  activeSlug.value = id
}

let cleanup: (() => void) | undefined

onMounted(() => {
  const article = articleRef.value
  const tocPanel = tocPanelRef.value

  if (!article || !tocPanel || headings.value.length === 0) {
    return
  }

  const activeOffset = 160
  const topOffset = 112
  const gutter = 70

  const headingElements = Array.from(
    article.querySelectorAll<HTMLElement>('h2, h3, h4')
  )

  function syncActive() {
    if (!headingElements.length) return
    let candidate = headingElements[0]
    for (const heading of headingElements) {
      const top = heading.getBoundingClientRect().top
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
    const articleRect = article.getBoundingClientRect()
    const articleTop = articleRect.top + window.scrollY
    const articleRight = articleRect.right + window.scrollX
    const isFixed = window.scrollY + topOffset >= articleTop

    if (isFixed) {
      tocPanel.style.position = 'fixed'
      tocPanel.style.top = `${topOffset}px`
      tocPanel.style.left = `${articleRight + gutter}px`
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
    window.requestAnimationFrame(onFrame)
  }

  function onResize() {
    syncPosition()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  syncActive()
  syncPosition()

  cleanup = () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  }
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <div class="relative min-h-screen">
    <GridBackground class="h-full w-full" />

    <main class="relative z-30 mx-auto mt-10 max-w-4xl border-x border-zinc-800 bg-zinc-950 pb-1 text-zinc-200">
      <div
        class="relative flex flex-col justify-stretch px-5 pt-6 md:pt-20">
        <!-- Header -->
        <div class="mx-auto w-full max-w-2xl px-5 lg:px-0">
          <h1 class="text-3xl font-bold uppercase tracking-tight text-white md:mb-8 md:text-4xl lg:text-5xl">
            {{ about.title }}
          </h1>

          <div class="label-mono mb-6 text-[11px] text-zinc-600">
            {{ about.name }}
            /
            <NuxtLink to="/" class="underline underline-offset-4 hover:text-sky-300">
              Home
            </NuxtLink>
            /
            <NuxtLink to="/posts" class="underline underline-offset-4 hover:text-sky-300">
              Posts
            </NuxtLink>
          </div>

          <!-- TOC -->
          <details v-if="headings.length > 0" class="group mb-10 border border-zinc-800 bg-black">
            <summary class="flex cursor-pointer select-none items-center justify-between px-4 py-3">
              <span class="label-mono text-[11px] text-zinc-300">
                Table of Content
              </span>
              <span class="label-mono text-[11px] text-zinc-600 group-open:hidden">Expand</span>
              <span class="label-mono hidden text-[11px] text-zinc-600 group-open:inline">Collapse</span>
            </summary>
            <nav class="mt-2 space-y-2 border-t border-zinc-800 px-4 py-4 text-[12px] text-zinc-500">
              <button
                v-for="heading in headings"
                :key="heading.id"
                type="button"
                class="block w-full cursor-pointer border-0 bg-transparent p-0 text-left leading-relaxed transition-colors hover:text-zinc-100"
                :class="{
                  'ml-4': heading.level === 2,
                  'ml-10': heading.level >= 3
                }"
                @click="scrollToHeading(heading.id)"
              >
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
            class="pointer-events-none absolute top-0 left-[calc(100%+44px)] hidden w-42.5 xl:block" aria-label="About table of content">
            <div ref="tocPanelRef" class="group/toc pointer-events-auto flex flex-col gap-2"
              style="position: absolute; top: 0; left: 0">
              <button v-for="heading in headings" :key="heading.id" type="button"
                class="group/toc-link relative flex w-full cursor-pointer items-center justify-start border-0 bg-transparent py-1 pr-1 text-left text-xs"
                :title="heading.text" :aria-label="`Jump to ${heading.text}`"
                :aria-current="activeSlug === heading.id ? 'true' : undefined" @click="scrollToHeading(heading.id)">
                <span
                  class="toc-line block h-0.75 bg-zinc-600 opacity-80 transition-all duration-150 group-hover/toc:opacity-0!"
                  :class="{
                    'w-12': heading.level === 2,
                    'w-8': heading.level >= 3,
                    'is-active': activeSlug === heading.id
                  }" />
                <span
                  class="absolute inset-y-0 left-0 flex items-center pr-4 text-[11px] text-zinc-600 opacity-0 transition-opacity duration-150 group-hover/toc:opacity-100"
                  :class="{
                    'pl-0': heading.level === 2,
                    'pl-3': heading.level >= 3,
                    'font-semibold text-zinc-100!': activeSlug === heading.id
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
  color: #d4d4d8;
}

.article-content :deep(h3) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #d4d4d8;
}

.article-content :deep(h4) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #d4d4d8;
}

.article-content :deep(p) {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.article-content :deep(a) {
  color: inherit;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.article-content :deep(a) {
  color: #7dd3fc;
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
  background-color: #38bdf8;
  opacity: 1;
}

.group\/toc:hover .toc-line {
  opacity: 0 !important;
}
</style>
