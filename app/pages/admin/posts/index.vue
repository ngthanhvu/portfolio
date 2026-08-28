<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data, refresh } = await useFetch('/api/posts')

async function deletePost(id: number) {
  if (!confirm('Are you sure?')) return
  await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Posts</h1>
      <NuxtLink to="/admin/posts/create"
        class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
        New Post
      </NuxtLink>
    </div>

    <div class="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table class="w-full text-sm text-left">
        <thead class="bg-neutral-50 text-neutral-700">
          <tr>
            <th class="px-4 py-3 font-medium">Title</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Published</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-for="post in data?.data" :key="post.id">
            <td class="px-4 py-3">{{ post.title }}</td>
            <td class="px-4 py-3">{{ post.category }}</td>
            <td class="px-4 py-3">{{ new Date(post.publishedAt).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <NuxtLink :to="`/admin/posts/${post.id}`" class="text-blue-600 hover:underline">Edit</NuxtLink>
              <button class="text-red-600 hover:underline" @click="deletePost(post.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
