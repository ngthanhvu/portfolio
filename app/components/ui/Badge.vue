<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
}>(), {
  variant: 'default'
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
    :class="{
      'border-transparent bg-foreground text-background': variant === 'default',
      'border-transparent bg-muted text-foreground': variant === 'secondary',
      'border-border bg-transparent text-foreground': variant === 'outline',
      'border-transparent bg-transparent text-muted-foreground hover:bg-muted': variant === 'ghost'
    }"
  >
    <slot />
  </span>
</template>
