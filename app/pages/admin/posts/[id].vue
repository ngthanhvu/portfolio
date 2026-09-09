<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Edit Post | Admin',
})

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)

const { data: post, refresh } = await useFetch(`/api/posts/${id}`)

const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  if (!post.value) return

  submitting.value = true
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
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="post">
    <header class="mb-8">
      <NuxtLink
        to="/admin/posts"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Back to Posts
      </NuxtLink>
      <div class="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            Edit Post
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Editing <span class="font-medium text-foreground">{{ post.title }}</span>
          </p>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          ID #{{ post.id }}
        </span>
      </div>
    </header>

    <form class="space-y-6 pb-24" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormSection title="Content" description="The main body of your post." icon="lucide:file-text">
            <FormField label="Title" required>
              <input
                v-model="post.title"
                type="text"
                required
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
            <FormField label="Slug" required>
              <input
                v-model="post.slug"
                type="text"
                required
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
            <FormField label="Excerpt" required hint="Short summary shown in post listings.">
              <textarea
                v-model="post.excerpt"
                rows="3"
                required
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FormField>
            <FormField label="Content (HTML)" required hint="Raw HTML markup for the article body.">
              <textarea
                v-model="post.content"
                rows="12"
                required
                class="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FormField>
          </FormSection>
        </div>

        <div class="space-y-6">
          <FormSection title="Organize" icon="lucide:tag">
            <FormField label="Category" required>
              <input
                v-model="post.category"
                type="text"
                required
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
          </FormSection>

          <FormSection title="Publish" icon="lucide:calendar-clock">
            <FormField label="Cover Image URL" hint="Recommended 1200×630.">
              <input
                v-model="post.coverImage"
                type="url"
                placeholder="https://..."
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
            <FormField label="Read Time">
              <input
                v-model="post.readTime"
                type="text"
                placeholder="5 phút"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
            <FormField label="Author ID" required>
              <input
                v-model.number="post.authorId"
                type="number"
                required
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
          </FormSection>
        </div>
      </div>

      <p
        v-if="error"
        class="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
      >
        <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
        {{ error }}
      </p>

      <div
        class="fixed bottom-0 right-0 z-30 flex items-center justify-end gap-3 border-t border-border bg-background/80 px-8 py-4 backdrop-blur"
        :class="collapsed ? 'left-16' : 'left-64'"
      >
        <button
          type="button"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          @click="refresh()"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
          Reset
        </button>
        <NuxtLink
          to="/admin/posts"
          class="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon v-if="submitting" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
