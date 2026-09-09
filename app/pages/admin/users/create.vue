<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Create User | Admin',
})

const router = useRouter()

const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)

const form = reactive({
  name: '',
  nickname: '',
  email: '',
  password: '',
  avatar: '',
  role: 'author',
})

const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: form,
    })
    router.push('/admin/users')
  }
  catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to create user'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <header class="mb-8">
      <NuxtLink to="/admin/users"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Back to Users
      </NuxtLink>
      <div class="mt-2">
        <h1 class="text-2xl font-bold text-foreground">
          Create User
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Add a new author or administrator.
        </p>
      </div>
    </header>

    <form class="space-y-6 pb-24" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormSection title="Profile" description="Public-facing information." icon="lucide:user">
            <div class="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" required>
                <input v-model="form.name" type="text" required placeholder="Jane Doe"
                  class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              </FormField>
              <FormField label="Nickname" required>
                <input v-model="form.nickname" type="text" required placeholder="jane"
                  class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              </FormField>
            </div>
            <FormField label="Email" required>
              <input v-model="form.email" type="email" required placeholder="jane@example.com"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <FormField label="Avatar URL" hint="Shown next to posts and comments.">
              <input v-model="form.avatar" type="url" placeholder="https://..."
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
          </FormSection>
        </div>

        <div class="space-y-6">
          <FormSection title="Access" description="Sign-in credentials and permissions." icon="lucide:shield-check">
            <FormField label="Password" required hint="Minimum 8 characters recommended.">
              <input v-model="form.password" type="password" required placeholder="••••••••"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <FormField label="Role" required hint="Admins can manage users and settings.">
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="opt in [{ v: 'author', l: 'Author', i: 'lucide:user' }, { v: 'admin', l: 'Admin', i: 'lucide:crown' }]"
                  :key="opt.v"
                  class="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
                  :class="form.role === opt.v ? 'border-foreground bg-muted text-foreground' : 'border-border text-muted-foreground hover:bg-accent'">
                  <input v-model="form.role" type="radio" :value="opt.v"
                    class="h-4 w-4 border-border text-foreground focus-visible:ring-ring">
                  <Icon :name="opt.i" class="h-4 w-4" />
                  {{ opt.l }}
                </label>
              </div>
            </FormField>
          </FormSection>

          <FormSection v-if="form.avatar || form.name" title="Preview" icon="lucide:eye">
            <div class="flex items-center gap-3">
              <img v-if="form.avatar" :src="form.avatar" :alt="form.name" class="h-12 w-12 rounded-full object-cover">
              <div v-else
                class="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {{ (form.name || '?').charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-foreground">
                  {{ form.name || 'Unnamed' }}
                </p>
                <p class="truncate text-xs text-muted-foreground">
                  {{ form.nickname ? `@${form.nickname}` : 'no nickname' }}
                </p>
              </div>
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
        <NuxtLink to="/admin/users"
          class="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          Cancel
        </NuxtLink>
        <button type="submit" :disabled="submitting"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
          <Icon v-if="submitting" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
          {{ submitting ? 'Creating...' : 'Create User' }}
        </button>
      </div>
    </form>
  </div>
</template>
