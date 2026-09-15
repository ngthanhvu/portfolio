<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input
    v-model="model"
    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-slate-400 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
  />
</template>
