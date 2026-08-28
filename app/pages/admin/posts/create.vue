<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const router = useRouter()

const form = reactive({
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  authorId: 1,
  publishedAt: '',
  readTime: '',
  tagIds: [] as number[],
})

const error = ref('')

async function onSubmit() {
  try {
    await $fetch('/api/posts', {
      method: 'POST',
      body: {
        ...form,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
      },
    })
    router.push('/admin/posts')
  }
  catch (err: any) {
    error.value = err?.message || 'Failed to create post'
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Create Post</h1>

    <form class="max-w-2xl space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">Slug</label>
        <input v-model="form.slug" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input v-model="form.title" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Excerpt</label>
        <textarea v-model="form.excerpt" rows="3" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Content (HTML)</label>
        <textarea v-model="form.content" rows="8" class="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Cover Image URL</label>
        <input v-model="form.coverImage" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Category</label>
        <input v-model="form.category" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Read Time</label>
        <input v-model="form.readTime" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" placeholder="5 phút" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Published At</label>
        <input v-model="form.publishedAt" type="datetime-local" class="w-full rounded-md border border-neutral-300 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Author ID</label>
        <input v-model.number="form.authorId" type="number" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <div class="flex gap-2">
        <button type="submit" class="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800">Create</button>
        <NuxtLink to="/admin/posts" class="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>
