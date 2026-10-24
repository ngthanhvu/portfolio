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
  <footer class="relative z-20 border-t border-zinc-800 bg-black">
    <div class="mx-auto flex h-10 max-w-5xl items-center justify-center gap-3 px-4 text-[11px] sm:px-6 lg:px-8">
      <NuxtLink to="/" class="label-mono hidden shrink-0 items-center gap-2 text-zinc-100 sm:flex">
        <span class="text-[9px] leading-none text-sky-400">●</span>
        <span class="max-w-40 truncate">{{ profile.name }}</span>
      </NuxtLink>

      <span class="label-mono hidden border-l border-zinc-800 pl-3 text-zinc-500 sm:inline">
        UP {{ runningDays.toLocaleString() }}D
      </span>

      <span class="label-mono truncate text-zinc-500">
        &copy; {{ currentYear }} {{ profile.name }}
      </span>

      <NuxtLink to="/sitemap.xml"
        class="label-mono hidden border-l border-zinc-800 pl-3 text-zinc-500 transition-colors hover:text-zinc-100 sm:inline">
        SITEMAP
      </NuxtLink>
    </div>
  </footer>
</template>
