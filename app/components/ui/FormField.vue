<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  required?: boolean
  hint?: string
}>(), {
  required: false,
  hint: undefined,
})
</script>

<template>
  <div class="space-y-1.5">
    <label class="block text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <p v-if="hint" class="text-xs text-muted-foreground">
      {{ hint }}
    </p>
    <slot />
  </div>
</template>
