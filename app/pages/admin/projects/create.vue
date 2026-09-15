<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Create Project | Admin',
})

const router = useRouter()

const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)

const form = reactive({
  name: '',
  description: '',
  image: '',
  url: '',
})

const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  try {
    await $fetch('/api/projects', {
      method: 'POST',
      body: form,
    })
    router.push('/admin/projects')
  }
  catch (err: any) {
    error.value = err?.message || 'Failed to create project'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <header class="mb-8">
      <NuxtLink to="/admin/projects"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Back to Projects
      </NuxtLink>
      <div class="mt-2">
        <h1 class="text-2xl font-bold text-foreground">
          Create Project
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Add something you have built or contributed to.
        </p>
      </div>
    </header>

    <form class="space-y-6 pb-24" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormSection title="Details" description="What is this project about?" icon="lucide:folder-git-2">
            <FormField label="Name" required>
              <input v-model="form.name" type="text" required placeholder="Portfolio"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300">
            </FormField>
            <FormField label="Description" required hint="A short paragraph describing the project.">
              <textarea v-model="form.description" rows="6" required
                placeholder="A Nuxt-powered portfolio with blog, projects and admin."
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300" />
            </FormField>
          </FormSection>
        </div>

        <div class="space-y-6">
          <FormSection title="Media & Links" icon="lucide:image">
            <FormField label="Image URL" hint="Thumbnail shown on the projects grid.">
              <input v-model="form.image" type="url" placeholder="https://..."
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300">
            </FormField>
            <div v-if="form.image" class="overflow-hidden rounded-md border border-border bg-muted">
              <img :src="form.image" :alt="form.name || 'Preview'" class="h-32 w-full object-cover">
            </div>
            <FormField label="Project URL" required hint="Where should visitors go to learn more?">
              <input v-model="form.url" type="url" required placeholder="https://github.com/you/project"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300">
            </FormField>
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
        <NuxtLink to="/admin/projects" title="Cancel"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent">
          <Icon name="lucide:x" class="h-4 w-4" />
        </NuxtLink>
        <button type="submit" :disabled="submitting" title="Save"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
          <Icon v-if="submitting" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:check" class="h-4 w-4" />
        </button>
      </div>
    </form>
  </div>
</template>
