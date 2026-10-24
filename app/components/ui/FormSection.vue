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
  <section class="overflow-hidden border border-zinc-800 bg-zinc-950">
    <header
      v-if="title"
      class="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/60 px-5 py-3"
    >
      <span
        v-if="icon"
        class="flex h-7 w-7 shrink-0 items-center justify-center border border-zinc-700 bg-black text-zinc-300"
      >
        <Icon :name="icon" class="h-4 w-4" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="label-mono text-[11px] text-zinc-200">
          {{ title }}
        </h2>
        <p v-if="description" class="label-mono mt-0.5 truncate text-[10px] text-zinc-600">
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
