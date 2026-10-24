<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
}>(), {
  variant: 'default'
})
</script>

<template>
  <span
    class="label-mono inline-flex items-center border px-1.5 py-px text-[11px] leading-5 transition-colors"
    :class="{
      'border-sky-500/40 bg-sky-500/10 text-sky-300': variant === 'default',
      'border-zinc-700 bg-zinc-900/60 text-zinc-300': variant === 'secondary',
      'border-zinc-800 bg-transparent text-zinc-500': variant === 'outline',
      'border-transparent bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-200': variant === 'ghost'
    }"
  >
    <slot />
  </span>
</template>
