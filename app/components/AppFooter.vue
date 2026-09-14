<script setup lang="ts">
const { profile, fetchProfile } = useProfile()

onMounted(() => {
  fetchProfile()
})

const runningDays = computed(() => {
  if (!profile.value?.startDate) return 0
  const start = new Date(profile.value.startDate).getTime()
  const diff = Date.now() - start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="relative z-20 border-t border-neutral-200 bg-white">
    <div class="container mx-auto max-w-7xl px-7 py-2">
      <!-- Branding: centered on mobile, shown inline on desktop -->
      <div class="mb-3 flex justify-center sm:hidden">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <img :src="profile.avatar" :alt="profile.name" class="h-5 w-5 rounded-full" />
          <span class="text-nowrap">Hi, {{ profile.name }}</span>
        </NuxtLink>
      </div>

      <!-- Single centered item on mobile, flex row on desktop -->
      <div class="flex justify-center sm:flex sm:flex-row sm:items-center sm:justify-center">
        <NuxtLink to="/" class="hidden items-center gap-2 text-sm font-semibold text-neutral-900 sm:flex">
          <img :src="profile.avatar" :alt="profile.name" class="h-5 w-5 rounded-full" />
          <span class="text-nowrap">Hi, {{ profile.name }}</span>
        </NuxtLink>

        <p
          class="hidden text-center text-xs leading-snug text-neutral-700 sm:block sm:ml-4 sm:border-l sm:border-neutral-300 sm:pl-4 sm:text-left sm:text-sm">
          Running for {{ runningDays.toLocaleString() }} days
        </p>

        <p
          class="text-center text-xs leading-snug text-neutral-700 sm:ml-4 sm:border-l sm:border-neutral-300 sm:pl-4 sm:text-left sm:text-sm">
          &copy; {{ currentYear }} {{ profile.name }}. All rights reserved. Please credit when sharing.
        </p>

        <NuxtLink to="/sitemap.xml"
          class="hidden text-center text-xs leading-snug text-neutral-700 transition-colors hover:text-neutral-900 sm:inline sm:ml-4 sm:border-l sm:border-neutral-300 sm:pl-4 sm:text-left sm:text-sm">
          Sitemap
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>