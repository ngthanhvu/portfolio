<script setup lang="ts">
const route = useRoute()
const { profile, fetchProfile } = useProfile()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

onMounted(() => {
  fetchProfile()
})

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/posts' },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 16
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(route, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header
    class="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'h-14' : 'h-20'"
  >
    <div
      class="mx-auto flex h-full max-w-5xl items-center justify-between px-4 transition-all duration-300 lg:rounded-b-xl lg:border-l lg:border-r"
      :class="isScrolled
        ? 'border-b border-l-0 border-r-0 border-neutral-300/50 bg-white/80 backdrop-blur-2xl lg:border-neutral-300/50'
        : 'border-transparent bg-transparent'"
    >
      <NuxtLink to="/" class="relative z-30 flex items-center gap-2 text-sm font-semibold text-neutral-900">
        <img :src="profile.avatar" :alt="profile.name" class="h-5 w-5 rounded-full" />
        <span class="text-nowrap">Hi, {{ profile.name }}</span>
      </NuxtLink>

      <nav class="relative z-30 flex items-center gap-1 text-sm text-neutral-500">
        <!-- Mobile menu toggle -->
        <button
          class="flex h-6 w-6 items-center justify-center sm:hidden"
          aria-label="Toggle menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon name="lucide:menu" class="h-5 w-5" />
        </button>

        <!-- Desktop nav -->
        <div class="hidden items-center gap-1 sm:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="px-3 py-2 font-medium text-neutral-500 transition-colors hover:text-neutral-900"
            :class="route.path === link.path ? 'text-neutral-900' : ''"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-x-0 top-14 z-40 px-3 pb-4 pt-2 sm:hidden"
    >
      <div class="relative rounded-xl border border-dashed border-neutral-300 bg-white p-2 backdrop-blur-sm">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="block rounded-lg px-3 py-2 text-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          :class="route.path === link.path ? 'text-neutral-900' : ''"
        >
          {{ link.name }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
