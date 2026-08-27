<script setup lang="ts">
const { profile } = useProfile()

const runningDays = computed(() => {
  const start = new Date(profile.value.startDate)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="relative z-20 border-t border-neutral-200 bg-white">
    <div class="container mx-auto flex max-w-7xl flex-col items-center justify-center px-7 py-8 sm:flex-row">
      <NuxtLink to="/" class="flex items-center gap-2 text-sm font-semibold text-neutral-900">
        <img :src="profile.avatar" :alt="profile.name" class="h-5 w-5 rounded-full" />
        <span class="text-nowrap">Hi, {{ profile.name }}</span>
      </NuxtLink>

      <p class="mt-4 text-sm text-neutral-700 sm:ml-4 sm:mt-0 sm:border-l sm:border-neutral-300 sm:pl-4">
        Running for {{ runningDays.toLocaleString() }} days
      </p>

      <p class="mt-4 text-sm text-neutral-700 sm:ml-4 sm:mt-0 sm:border-l sm:border-neutral-300 sm:pl-4">
        &copy; {{ currentYear }} {{ profile.name }}. All rights reserved. Please credit when sharing.
      </p>

      <NuxtLink
        to="/sitemap.xml"
        class="mt-4 text-sm text-neutral-700 transition-colors hover:text-neutral-900 sm:ml-4 sm:mt-0 sm:border-l sm:border-neutral-300 sm:pl-4"
      >
        Sitemap
      </NuxtLink>
    </div>
  </footer>
</template>
