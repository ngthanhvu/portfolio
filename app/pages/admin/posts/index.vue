<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data, refresh } = await useFetch('/api/posts')

const selected = ref<Set<number>>(new Set())

const posts = computed(() => data.value?.data || [])

const allSelected = computed({
  get: () => posts.value.length > 0 && posts.value.every((p) => selected.value.has(p.id)),
  set: (value: boolean) => {
    selected.value = new Set(value ? posts.value.map((p) => p.id) : [])
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

async function deletePost(id: number) {
  if (!confirm('Are you sure?')) return
  await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
  refresh()
}

async function deleteSelected() {
  if (!confirm(`Delete ${selected.value.size} posts?`)) return
  await Promise.all(Array.from(selected.value).map((id) => $fetch(`/api/posts/${id}`, { method: 'DELETE' })))
  selected.value = new Set()
  refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Posts</h1>
      <NuxtLink to="/admin/posts/create"
        class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 cursor-pointer">
        <Icon name="lucide:plus" class="h-4 w-4 mr-2" />
        Create
      </NuxtLink>
    </div>

    <div v-if="selected.size > 0" class="mb-4 flex items-center gap-3">
      <span class="text-sm text-neutral-600">{{ selected.size }} selected</span>
      <button
        class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
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
            <th class="px-4 py-3 font-medium">Title</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Published</th>
            <th class="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-if="!posts.length">
            <td colspan="6" class="px-4 py-8 text-neutral-500">
              No posts found.
            </td>
          </tr>
          <tr v-for="(post, index) in posts" :key="post.id">
            <td class="px-4 py-3">
              <input :checked="selected.has(post.id)" type="checkbox" class="h-4 w-4 rounded border-neutral-300"
                @change="toggleRow(post.id)" />
            </td>
            <td class="px-4 py-3 text-neutral-500">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ post.title }}</td>
            <td class="px-4 py-3">{{ post.category }}</td>
            <td class="px-4 py-3">{{ new Date(post.publishedAt).toLocaleDateString() }}</td>
            <td class="px-4 py-3">
              <div class="inline-flex items-center gap-2">
                <NuxtLink :to="`/admin/posts/${post.id}`"
                  class="inline-flex items-center rounded-md bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </NuxtLink>
                <button class="inline-flex items-center rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                  @click="deletePost(post.id)">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
