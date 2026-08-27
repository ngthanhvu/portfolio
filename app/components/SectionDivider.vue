<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="relative my-16">
    <div class="relative w-full">
      <div class="absolute w-full h-px bg-linear-to-r from-transparent via-transparent to-white" />
      <div class="w-full h-px border-t border-dashed border-neutral-300" />
    </div>
    <div class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
      <div
        class="flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500 shadow-sm">
        <span>{{ label }}</span>
        <div class="flex items-center justify-center w-5 h-5 translate-x-1 border rounded-full border-neutral-100">
          <!-- <Icon name="lucide:chevrons-down" class="h-3 w-3" /> -->
          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
