<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}>(), {
  variant: 'default',
  size: 'md'
})
</script>

<template>
  <button
    class="label-mono inline-flex select-none items-center justify-center gap-1.5 border px-2.5 text-[11px] font-medium leading-normal transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40"
    :class="{
      'border-sky-500/40 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-200 active:bg-sky-500/30': variant === 'default',
      'border-zinc-700/80 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700': variant === 'outline',
      'border-transparent bg-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100': variant === 'ghost',
      'h-auto border-transparent p-0 text-sky-300 underline-offset-4 hover:underline': variant === 'link',
      'h-7': size === 'sm',
      'h-9': size === 'md',
      'h-10': size === 'lg',
      'h-9 w-9 p-0': size === 'icon'
    }"
  >
    <slot />
  </button>
</template>
