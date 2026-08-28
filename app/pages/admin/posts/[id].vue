<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { data: post, refresh } = await useFetch(`/api/posts/${id}`)

const error = ref('')

async function onSubmit() {
  if (!post.value) return

  try {
    await $fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: {
        ...post.value,
        publishedAt: post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
      },
    })
    router.push('/admin/posts')
  }
  catch (err: any) {
    error.value = err?.message || 'Failed to update post'
  }
}
</script>

<template>
  <div v-if="post">
    <h1 class="text-2xl font-bold mb-6">Edit Post</h1>

    <form class="max-w-2xl space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">Slug</label>
        <input v-model="post.slug" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input v-model="post.title" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Excerpt</label>
        <textarea v-model="post.excerpt" rows="3" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Content (HTML)</label>
        <textarea v-model="post.content" rows="8" class="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Cover Image URL</label>
        <input v-model="post.coverImage" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Category</label>
        <input v-model="post.category" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Read Time</label>
        <input v-model="post.readTime" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Author ID</label>
        <input v-model.number="post.authorId" type="number" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <div class="flex gap-2">
        <button type="submit" class="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800">Update</button>
        <NuxtLink to="/admin/posts" class="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>
