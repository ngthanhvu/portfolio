<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Edit Project | Admin',
})

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)

const { data: project, refresh } = await useFetch(`/api/projects/${id}`)

const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  if (!project.value) return

  submitting.value = true
  try {
    await $fetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: project.value,
    })
    router.push('/admin/projects')
  }
  catch (err: any) {
    error.value = err?.message || 'Failed to update project'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="project">
    <header class="mb-8">
      <NuxtLink
        to="/admin/projects"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Back to Projects
      </NuxtLink>
      <div class="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            Edit Project
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Editing <span class="font-medium text-foreground">{{ project.name }}</span>
          </p>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          ID #{{ project.id }}
        </span>
      </div>
    </header>

    <form class="space-y-6 pb-24" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormSection title="Details" description="What is this project about?" icon="lucide:folder-git-2">
            <FormField label="Name" required>
              <input
                v-model="project.name"
                type="text"
                required
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
            <FormField label="Description" required hint="A short paragraph describing the project.">
              <textarea
                v-model="project.description"
                rows="6"
                required
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FormField>
          </FormSection>
        </div>

        <div class="space-y-6">
          <FormSection title="Media & Links" icon="lucide:image">
            <FormField label="Image URL" hint="Thumbnail shown on the projects grid.">
              <input
                v-model="project.image"
                type="url"
                placeholder="https://..."
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
            </FormField>
            <div
              v-if="project.image"
              class="overflow-hidden rounded-md border border-border bg-muted"
            >
              <img :src="project.image" :alt="project.name" class="h-32 w-full object-cover">
            </div>
            <FormField label="Project URL" required>
              <input
                v-model="project.url"
                type="url"
                required
                placeholder="https://github.com/you/project"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          to="/admin/projects"
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
