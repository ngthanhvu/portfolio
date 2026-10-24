<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input
    v-model="model"
    class="label-mono flex h-9 w-full border border-zinc-800 bg-black px-3 py-2 text-[12px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40"
  />
</template>
