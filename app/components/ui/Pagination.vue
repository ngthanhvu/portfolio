<script setup lang="ts">
const props = defineProps<{
  page: number
  pageCount: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{ (e: 'update:page', value: number): void }>()

const pages = computed(() => {
  const last = props.pageCount
  const current = props.page
  const max = 5
  const start = Math.max(1, Math.min(current - 2, last - max + 1))
  const end = Math.min(last, start + max - 1)
  const arr: number[] = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})

const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.page * props.pageSize, props.total))

function go(p: number) {
  if (p < 1 || p > props.pageCount || p === props.page) return
  emit('update:page', p)
}
</script>

<template>
  <div v-if="total > 0" class="flex flex-wrap items-center justify-between gap-3 px-1 pt-4">
    <p class="text-xs text-muted-foreground">
      Showing <span class="font-medium text-foreground">{{ from }}</span>–<span class="font-medium text-foreground">{{ to }}</span>
      of <span class="font-medium text-foreground">{{ total }}</span>
    </p>
    <div v-if="pageCount > 1" class="flex items-center gap-1">
      <button
        type="button"
        :disabled="page <= 1"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        aria-label="Previous page"
        @click="go(page - 1)"
      >
        <Icon name="lucide:chevron-left" class="h-4 w-4" />
      </button>
      <button
        v-for="p in pages"
        :key="p"
        type="button"
        class="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors"
        :class="p === page
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:bg-accent'"
        @click="go(p)"
      >
        {{ p }}
      </button>
      <button
        type="button"
        :disabled="page >= pageCount"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        aria-label="Next page"
        @click="go(page + 1)"
      >
        <Icon name="lucide:chevron-right" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
