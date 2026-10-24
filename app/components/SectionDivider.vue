<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="relative my-16">
    <div class="relative w-full">
      <div class="w-full border-t border-zinc-800" />
    </div>
    <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
      <div class="flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-4 py-1.5">
        <span class="text-[9px] leading-none text-sky-400">●</span>
        <span class="label-mono text-[11px] text-zinc-500">{{ label }}</span>
      </div>
    </div>
  </div>
</template>
