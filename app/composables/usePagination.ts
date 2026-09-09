import type { Ref } from 'vue'

export function usePagination<T>(source: Ref<T[]>) {
  const page = ref(1)
  const pageSize = ref(8)

  const pageCount = computed(() => Math.max(1, Math.ceil(source.value.length / pageSize.value)))

  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return source.value.slice(start, start + pageSize.value)
  })

  function goTo(p: number) {
    page.value = Math.min(Math.max(1, p), pageCount.value)
  }

  function computePageSize() {
    const h = window.innerHeight
    if (h < 700) pageSize.value = 5
    else if (h < 900) pageSize.value = 8
    else if (h < 1100) pageSize.value = 10
    else pageSize.value = 12
  }

  watch(pageCount, (count) => {
    if (page.value > count) page.value = count
  })

  onMounted(() => {
    computePageSize()
    window.addEventListener('resize', computePageSize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', computePageSize)
  })

  return { page, pageSize, pageCount, paginated, goTo }
}
