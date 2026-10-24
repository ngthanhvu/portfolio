<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Comments | Admin',
})

const { data, refresh } = await useFetch('/api/comments')

const selected = ref<Set<number>>(new Set())

const comments = computed(() => data.value?.data || [])

const { page, pageSize, pageCount, paginated, goTo } = usePagination(comments)

const allSelected = computed({
  get: () => comments.value.length > 0 && comments.value.every((c) => selected.value.has(c.id)),
  set: (value: boolean) => {
    selected.value = new Set(value ? comments.value.map((c) => c.id) : [])
  },
})

function toggleRow(id: number) {
  const newSet = new Set(selected.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  }
  else {
    newSet.add(id)
  }
  selected.value = newSet
}

async function deleteComment(id: number) {
  if (!confirm('Are you sure?')) return
  await $fetch(`/api/comments/${id}`, { method: 'DELETE' })
  refresh()
}

async function deleteSelected() {
  if (!confirm(`Delete ${selected.value.size} comments?`)) return
  await Promise.all(Array.from(selected.value).map((id) => $fetch(`/api/comments/${id}`, { method: 'DELETE' })))
  selected.value = new Set()
  refresh()
}
</script>

<template>
  <div class="w-full">
    <header class="mb-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Comments
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Moderate comments left on posts.
        </p>
      </div>
    </header>

    <div v-if="selected.size > 0"
      class="mb-4 flex items-center gap-3 rounded-md border border-red-500/40 px-3 py-2">
      <Icon name="lucide:check-square" class="h-4 w-4 text-red-400" />
      <span class="text-sm font-medium text-red-400">{{ selected.size }} selected</span>
      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-500/20 text-red-400 transition-colors"
        title="Delete selected" @click="deleteSelected">
        <Icon name="lucide:trash-2" class="h-4 w-4" />
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg border border-border bg-card">
      <table class="w-full min-w-180 text-sm">
        <thead
          class="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <tr>
            <th class="w-10 px-4 py-3 text-center">
              <input v-model="allSelected" type="checkbox" class="h-4 w-4 rounded border-border">
            </th>
            <th class="w-16 px-4 py-3 text-center">
              STT
            </th>
            <th class="px-4 py-3 text-center">
              Author
            </th>
            <th class="px-4 py-3 text-center">
              Content
            </th>
            <th class="w-24 px-4 py-3 text-center">
              Post ID
            </th>
            <th class="px-4 py-3 text-center">
              Status
            </th>
            <th class="w-24 px-4 py-3 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="!comments.length">
            <td colspan="7" class="px-4 py-12 text-center text-muted-foreground">
              No comments found.
            </td>
          </tr>
          <tr v-for="(comment, index) in paginated" :key="comment.id" class="transition-colors hover:bg-muted/30">
            <td class="px-4 py-3 text-center">
              <input :checked="selected.has(comment.id)" type="checkbox" class="h-4 w-4 rounded border-border"
                @change="toggleRow(comment.id)">
            </td>
            <td class="px-4 py-3 text-center text-muted-foreground">
              {{ (page - 1) * pageSize + index + 1 }}
            </td>
            <td class="px-4 py-3 text-center font-medium text-foreground">
              {{ comment.authorName }}
            </td>
            <td class="max-w-xs px-4 py-3 text-center text-muted-foreground">
              <span class="line-clamp-2">{{ comment.content }}</span>
            </td>
            <td class="px-4 py-3 text-center text-muted-foreground">
              #{{ comment.postId }}
            </td>
            <td class="px-4 py-3 text-center">
              <span class="label-mono inline-flex items-center gap-1 border px-2 py-0.5 text-xs" :class="comment.status === 'approved'
                ? 'border-green-500/40 bg-green-500/10 text-green-400'
                : 'border-border bg-muted text-muted-foreground'">
                <span class="h-1.5 w-1.5"
                  :class="comment.status === 'approved' ? 'bg-green-400' : 'bg-zinc-600'" />
                {{ comment.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1">
                <button
                  class="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 transition-colors"
                  title="Delete" @click="deleteComment(comment.id)">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination :page="page" :page-count="pageCount" :total="comments.length" :page-size="pageSize"
      @update:page="goTo" />
  </div>
</template>
