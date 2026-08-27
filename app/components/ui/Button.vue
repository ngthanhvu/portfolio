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
    class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    :class="{
      'bg-foreground text-background hover:bg-foreground/90': variant === 'default',
      'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground': variant === 'outline',
      'text-foreground hover:bg-accent': variant === 'ghost',
      'h-auto p-0 text-foreground underline-offset-4 hover:underline': variant === 'link',
      'h-8 px-3 text-xs': size === 'sm',
      'h-10 px-4 py-2 text-sm': size === 'md',
      'h-11 px-6 text-base': size === 'lg',
      'h-10 w-10 p-0': size === 'icon'
    }"
  >
    <slot />
  </button>
</template>
