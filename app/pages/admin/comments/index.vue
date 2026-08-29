<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data, refresh } = await useFetch('/api/comments')

const selected = ref<Set<number>>(new Set())

const comments = computed(() => data.value?.data || [])

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
  <div>
    <h1 class="text-2xl font-bold mb-6">Comments</h1>

    <div v-if="selected.size > 0" class="mb-4 flex items-center gap-3">
      <span class="text-sm text-neutral-600">{{ selected.size }} selected</span>
      <button class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
        @click="deleteSelected">
        <Icon name="lucide:trash-2" class="h-4 w-4" />
      </button>
    </div>

    <div class="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table class="w-full text-sm text-center">
        <thead class="bg-neutral-50 text-neutral-700">
          <tr>
            <th class="px-4 py-3 w-10">
              <input v-model="allSelected" type="checkbox" class="h-4 w-4 rounded border-neutral-300" />
            </th>
            <th class="px-4 py-3 font-medium w-16">STT</th>
            <th class="px-4 py-3 font-medium">Author</th>
            <th class="px-4 py-3 font-medium">Content</th>
            <th class="px-4 py-3 font-medium">Post ID</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-if="!comments.length">
            <td colspan="7" class="px-4 py-8 text-neutral-500">
              No comments found.
            </td>
          </tr>
          <tr v-for="(comment, index) in comments" :key="comment.id">
            <td class="px-4 py-3">
              <input :checked="selected.has(comment.id)" type="checkbox" class="h-4 w-4 rounded border-neutral-300"
                @change="toggleRow(comment.id)" />
            </td>
            <td class="px-4 py-3 text-neutral-500">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ comment.authorName }}</td>
            <td class="px-4 py-3 max-w-xs truncate">{{ comment.content }}</td>
            <td class="px-4 py-3">{{ comment.postId }}</td>
            <td class="px-4 py-3">{{ comment.status }}</td>
            <td class="px-4 py-3">
              <button
                class="inline-flex items-center rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                @click="deleteComment(comment.id)">
                <Icon name="lucide:trash-2" class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
