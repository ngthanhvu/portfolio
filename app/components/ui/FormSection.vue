<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
}>(), {
  description: undefined,
  icon: undefined,
})
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-border bg-card">
    <header
      v-if="title"
      class="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3.5"
    >
      <span
        v-if="icon"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-foreground"
      >
        <Icon :name="icon" class="h-4 w-4" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-sm font-semibold text-foreground">
          {{ title }}
        </h2>
        <p v-if="description" class="truncate text-xs text-muted-foreground">
          {{ description }}
        </p>
      </div>
      <slot name="action" />
    </header>
    <div class="space-y-4 p-5">
      <slot />
    </div>
  </section>
</template>
