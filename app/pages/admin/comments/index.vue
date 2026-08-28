<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data, refresh } = await useFetch('/api/comments')

async function deleteComment(id: number) {
  if (!confirm('Are you sure?')) return
  await $fetch(`/api/comments/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Comments</h1>

    <div class="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table class="w-full text-sm text-left">
        <thead class="bg-neutral-50 text-neutral-700">
          <tr>
            <th class="px-4 py-3 font-medium">Author</th>
            <th class="px-4 py-3 font-medium">Content</th>
            <th class="px-4 py-3 font-medium">Post ID</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-for="comment in data?.data" :key="comment.id">
            <td class="px-4 py-3">{{ comment.authorName }}</td>
            <td class="px-4 py-3 max-w-xs truncate">{{ comment.content }}</td>
            <td class="px-4 py-3">{{ comment.postId }}</td>
            <td class="px-4 py-3">{{ comment.status }}</td>
            <td class="px-4 py-3 text-right">
              <button class="text-red-600 hover:underline" @click="deleteComment(comment.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
