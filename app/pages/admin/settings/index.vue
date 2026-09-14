<script setup lang="ts">
import type { ApiProfile, ApiSocialLink } from '~/composables/useProfile'

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Settings | Admin',
})

const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)

const { data, pending, refresh } = await useFetch<{ profile: ApiProfile | null; socials: ApiSocialLink[] }>('/api/profile')

const form = reactive({
  name: '',
  nickname: '',
  tagline: '',
  bio: '',
  avatar: '',
  email: '',
  startDate: '',
})

const socials = ref<Array<{ name: string; url: string; icon: string }>>([])

watch(data, (value) => {
  if (!value) return
  const p = value.profile
  if (p) {
    form.name = p.name
    form.nickname = p.nickname
    form.tagline = p.tagline || ''
    form.bio = p.bio || ''
    form.avatar = p.avatar || ''
    form.email = p.email || ''
    form.startDate = p.startDate || ''
  }
  socials.value = (value.socials || []).map(link => ({
    name: link.name,
    url: link.url,
    icon: link.icon,
  }))
}, { immediate: true })

function addSocial() {
  socials.value.push({ name: '', url: '', icon: '' })
}

function removeSocial(index: number) {
  socials.value.splice(index, 1)
}

function moveSocial(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= socials.value.length) return
  const item = socials.value.splice(index, 1)[0]!
  socials.value.splice(target, 0, item)
}

const error = ref('')
const saving = ref(false)
const saved = ref(false)

async function onSubmit() {
  error.value = ''
  saved.value = false
  saving.value = true

  try {
    await $fetch('/api/profile', {
      method: 'PUT',
      body: { ...form, socials: socials.value },
    })
    saved.value = true
    await refresh()
    // Invalidate the public profile cache so the new avatar/name is reflected immediately
    // across the site (header, dashboard, homepage hero, etc.).
    refreshNuxtData('profile')
    setTimeout(() => { saved.value = false }, 2500)
  }
  catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to save'
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <header class="mb-8">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Manage the public profile and social links shown across the site.
          </p>
        </div>
        <span v-if="form.startDate"
          class="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          <Icon name="lucide:calendar" class="h-3 w-3" />
          Since {{ form.startDate }}
        </span>
      </div>
    </header>

    <div v-if="pending"
      class="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
      <Icon name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
      Loading profile...
    </div>

    <form v-else class="space-y-6 pb-24" @submit.prevent="onSubmit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <FormSection title="Profile" description="Shown in the hero section of the homepage." icon="lucide:user">
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
            <FormField label="Tagline" hint="A one-line headline under your name.">
              <input v-model="form.tagline" type="text" placeholder="Software engineer & builder of things"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <FormField label="Bio" hint="A short paragraph about you.">
              <textarea v-model="form.bio" rows="5" placeholder="I build web apps with Nuxt and TypeScript..."
                class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </FormField>
          </FormSection>
        </div>

        <div class="space-y-6">
          <FormSection title="Avatar & Contact" icon="lucide:contact">
            <FormField label="Avatar URL" hint="Square image works best.">
              <input v-model="form.avatar" type="url" placeholder="https://..."
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <div v-if="form.avatar || form.name"
              class="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-3">
              <img v-if="form.avatar" :src="form.avatar" :alt="form.name" class="h-12 w-12 rounded-full object-cover">
              <div v-else
                class="flex h-12 w-12 items-center justify-center rounded-full bg-background text-sm font-medium text-muted-foreground">
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
            <FormField label="Email">
              <input v-model="form.email" type="email" placeholder="jane@example.com"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
            <FormField label="Start Date" hint="When you started, used to calculate running days.">
              <input v-model="form.startDate" type="date"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </FormField>
          </FormSection>
        </div>
      </div>

      <FormSection title="Social Links" description="Ordered list of links in the hero." icon="lucide:link">
        <template #action>
          <button type="button"
            class="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            @click="addSocial">
            <Icon name="lucide:plus" class="h-3.5 w-3.5" />
            Add link
          </button>
        </template>

        <div v-if="!socials.length"
          class="rounded-md border border-dashed border-border bg-muted/30 px-3 py-8 text-center text-sm text-muted-foreground">
          No social links yet. Click "Add link" to create one.
        </div>

        <div v-for="(social, index) in socials" :key="index" class="rounded-md border border-border bg-background p-3">
          <div class="mb-2 flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon :name="social.icon || 'lucide:link'" class="h-3.5 w-3.5" />
              Link #{{ index + 1 }}
            </span>
            <div class="flex items-center gap-1">
              <button type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
                :disabled="index === 0" title="Move up" @click="moveSocial(index, -1)">
                <Icon name="lucide:chevron-up" class="h-4 w-4" />
              </button>
              <button type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
                :disabled="index === socials.length - 1" title="Move down" @click="moveSocial(index, 1)">
                <Icon name="lucide:chevron-down" class="h-4 w-4" />
              </button>
              <button type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded text-red-600 transition-colors hover:bg-red-50"
                title="Remove" @click="removeSocial(index)">
                <Icon name="lucide:trash-2" class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.5fr_1fr]">
            <input v-model="social.name" type="text" placeholder="Name (GitHub)"
              class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <input v-model="social.url" type="url" placeholder="https://github.com/you"
              class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div class="relative">
              <span
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground">
                <Icon :name="social.icon || 'lucide:globe'" class="h-4 w-4" />
              </span>
              <input v-model="social.icon" type="text" placeholder="simple-icons:github"
                class="flex h-10 w-full rounded-md border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            </div>
          </div>
        </div>
      </FormSection>

      <div v-if="error || saved" class="flex flex-wrap gap-2">
        <p v-if="error"
          class="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
          {{ error }}
        </p>
        <p v-if="saved"
          class="inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-600">
          <Icon name="lucide:check-circle-2" class="h-4 w-4 shrink-0" />
          Saved successfully.
        </p>
      </div>

      <div
        class="fixed bottom-0 right-0 z-30 flex items-center justify-end gap-3 border-t border-border bg-background/80 px-8 py-2 backdrop-blur"
        :class="collapsed ? 'left-16' : 'left-64'">
        <button type="button"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          @click="refresh()">
          <Icon name="lucide:refresh-cw" class="h-4 w-4" />
          Reset
        </button>
        <button type="submit" :disabled="saving"
          class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
          <Icon v-if="saving" name="lucide:loader-circle" class="h-4 w-4 animate-spin" />
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
