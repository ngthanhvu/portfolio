<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Edit User | Admin',
})

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)

const { data: user, refresh } = await useFetch(`/api/users/${id}`)

const newPassword = ref('')
const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  if (!user.value) return

  const body: any = {
    name: user.value.name,
    nickname: user.value.nickname,
    email: user.value.email,
    avatar: user.value.avatar,
    role: user.value.role,
  }

  if (newPassword.value) {
    body.password = newPassword.value
  }

  submitting.value = true
  try {
    await $fetch(`/api/users/${id}`, {
      method: 'PUT',
      body,
    })
    router.push('/admin/users')
  }
  catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to update user'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="user">
    <header class="mb-8">
      <NuxtLink
        to="/admin/users"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon name="lucide:arrow-left" class="h-4 w-4" />
        Back to Users
      </NuxtLink>
      <div class="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="h-10 w-10 rounded-full object-cover"
          >
          <div
            v-else
            class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground"
          >
            {{ (user.name || '?').charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-foreground">
              Edit User
            </h1>
            <p class="mt-1 text-sm text-muted-foreground">
              Editing <span class="font-medium text-foreground">{{ user.name }}</span>
            </p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          ID #{{ user.id }}
        </span>
      </div>
    </header>

    <form class="space-y-6 pb-24" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormSection title="Profile" description="Public-facing information." icon="lucide:user">
            <div class="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" required>
                <input
                  v-model="user.name"
                  type="text"
                  required
                  class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300"
                >
              </FormField>
              <FormField label="Nickname" required>
                <input
                  v-model="user.nickname"
                  type="text"
                  required
                  class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300"
                >
              </FormField>
            </div>
            <FormField label="Email" required>
              <input
                v-model="user.email"
                type="email"
                required
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300"
              >
            </FormField>
            <FormField label="Avatar URL" hint="Shown next to posts and comments.">
              <input
                v-model="user.avatar"
                type="url"
                placeholder="https://..."
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300"
              >
            </FormField>
          </FormSection>
        </div>

        <div class="space-y-6">
          <FormSection title="Access" description="Sign-in credentials and permissions." icon="lucide:shield-check">
            <FormField label="New Password" hint="Leave blank to keep the current password.">
              <input
                v-model="newPassword"
                type="password"
                placeholder="••••••••"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:border-slate-400 hover:border-slate-300"
              >
            </FormField>
            <FormField label="Role" required hint="Admins can manage users and settings.">
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="opt in [{ v: 'author', l: 'Author', i: 'lucide:user' }, { v: 'admin', l: 'Admin', i: 'lucide:crown' }]"
                  :key="opt.v"
                  class="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
                  :class="user.role === opt.v ? 'border-foreground bg-muted text-foreground' : 'border-border text-muted-foreground hover:bg-accent'"
                >
                  <input
                    v-model="user.role"
                    type="radio"
                    :value="opt.v"
                    class="h-4 w-4 border-border text-foreground focus-visible:ring-ring"
                  >
                  <Icon :name="opt.i" class="h-4 w-4" />
                  {{ opt.l }}
                </label>
              </div>
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
          title="Reset"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
          @click="refresh()"
        >
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
        </button>
        <NuxtLink
          to="/admin/users"
          title="Cancel"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
        >
          <Icon name="lucide:x" class="h-4 w-4" />
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting"
          title="Save"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon v-if="submitting" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
          <Icon v-else name="lucide:check" class="h-4 w-4" />
        </button>
      </div>
    </form>
  </div>
</template>
