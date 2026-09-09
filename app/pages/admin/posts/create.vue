<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Create Post | Admin',
})

const router = useRouter()

const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)

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
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
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
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <header class="mb-8">
      <NuxtLink to="/admin/posts"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Back to Posts
      </NuxtLink>
      <div class="mt-2">
        <h1 class="text-2xl font-bold text-foreground">
          Create Post
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Write a new blog post. Fields marked with <span class="text-red-500">*</span> are required.
        </p>
      </div>
    </header>

    <form class="space-y-6 pb-24" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormSection title="Content" description="The main body of your post." icon="lucide:file-text">
            <FormField label="Title" required>
              <input v-model="form.title" type="text" required placeholder="How I built my portfolio"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <FormField label="Slug" required hint="URL-friendly identifier, e.g. how-i-built-my-portfolio">
              <input v-model="form.slug" type="text" required placeholder="how-i-built-my-portfolio"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <FormField label="Excerpt" required hint="Short summary shown in post listings.">
              <textarea v-model="form.excerpt" rows="3" required
                placeholder="A quick walkthrough of the stack and decisions behind my portfolio."
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </FormField>
            <FormField label="Content (HTML)" required hint="Raw HTML markup for the article body.">
              <textarea v-model="form.content" rows="12" required
                class="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </FormField>
          </FormSection>
        </div>

        <div class="space-y-6">
          <FormSection title="Organize" icon="lucide:tag">
            <FormField label="Category" required>
              <input v-model="form.category" type="text" required placeholder="Engineering"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
          </FormSection>

          <FormSection title="Publish" icon="lucide:calendar-clock">
            <FormField label="Cover Image URL" hint="Recommended 1200×630.">
              <input v-model="form.coverImage" type="url" placeholder="https://..."
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <FormField label="Published At" hint="Leave empty to keep as draft.">
              <input v-model="form.publishedAt" type="datetime-local"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <div class="grid grid-cols-2 gap-4">
              <FormField label="Read Time">
                <input v-model="form.readTime" type="text" placeholder="5 phút"
                  class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              </FormField>
              <FormField label="Author ID" required>
                <input v-model.number="form.authorId" type="number" required
                  class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              </FormField>
            </div>
          </FormSection>
        </div>
      </div>

      <p v-if="error"
        class="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
        <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
        {{ error }}
      </p>

      <div
        class="fixed bottom-0 right-0 z-30 flex items-center justify-end gap-3 border-t border-border bg-background/80 px-8 py-2 backdrop-blur"
        :class="collapsed ? 'left-16' : 'left-64'">
        <NuxtLink to="/admin/posts"
          class="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="submitting"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
          <Icon v-if="submitting" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
          {{ submitting ? 'Creating...' : 'Create Post' }}
        </button>
      </div>
    </form>
  </div>
</template>
