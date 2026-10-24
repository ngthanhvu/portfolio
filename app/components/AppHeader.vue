<script setup lang="ts">
const route = useRoute()
const { profile, fetchProfile } = useProfile()
const isMobileMenuOpen = ref(false)

useHead({
  link: [{ rel: 'icon', href: () => profile.value.avatar || '/favicon.ico' }],
})

onMounted(() => {
  fetchProfile()
})

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/posts' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
]

watch(route, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-zinc-800 bg-black">
    <div class="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex min-w-0 items-center gap-2.5">
        <img :src="profile.avatar" :alt="profile.name"
          class="h-5 w-5 shrink-0 border border-zinc-700 bg-zinc-950 object-cover" />
        <span class="label-mono truncate text-[13px] font-bold tracking-[0.06em] text-white">
          HI, {{ profile.name }}
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-2">
        <!-- Mobile menu toggle -->
        <button
          class="flex h-7 w-7 items-center justify-center border border-zinc-700 bg-zinc-950 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100 sm:hidden"
          aria-label="Toggle menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon name="lucide:menu" class="h-4 w-4" />
        </button>

        <!-- Desktop nav -->
        <div class="hidden items-center gap-1.5 sm:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="label-mono border px-2.5 py-1 text-[11px] transition-colors duration-150"
            :class="route.path === link.path
              ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
              : 'border-zinc-700/80 bg-zinc-900/60 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100'"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="isMobileMenuOpen"
      class="border-t border-zinc-900 bg-black sm:hidden"
    >
      <nav class="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="label-mono border px-2.5 py-2 text-[11px] transition-colors duration-150"
          :class="route.path === link.path
            ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
            : 'border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-100'"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
