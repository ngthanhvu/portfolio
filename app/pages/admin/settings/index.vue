<script setup lang="ts">
import type { ApiProfile, ApiSocialLink } from '~/composables/useProfile'

definePageMeta({
  layout: 'admin',
})

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
  <div>
    <h1 class="text-2xl font-bold mb-6">Settings</h1>

    <div v-if="pending" class="text-neutral-500">Loading...</div>

    <form v-else class="max-w-2xl space-y-4" @submit.prevent="onSubmit">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500">Hero / Profile</h2>

      <div>
        <label class="mb-1 block text-sm font-medium">Name</label>
        <input v-model="form.name" type="text"
          class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none"
          required>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Nickname</label>
        <input v-model="form.nickname" type="text"
          class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none"
          required>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Tagline</label>
        <input v-model="form.tagline" type="text"
          class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none">
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Bio</label>
        <textarea v-model="form.bio" rows="4"
          class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Avatar URL</label>
        <input v-model="form.avatar" type="text"
          class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none">
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Email</label>
        <input v-model="form.email" type="email"
          class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none">
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Start Date</label>
        <input v-model="form.startDate" type="text"
          class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-neutral-500 focus:outline-none">
      </div>

      <div class="border-t border-neutral-200 pt-4">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500">Social Links</h2>
          <button type="button"
            class="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-sm font-medium hover:bg-neutral-200"
            @click="addSocial">
            <Icon name="lucide:plus" class="mr-1 h-4 w-4" />
            Add
          </button>
        </div>

        <div v-if="!socials.length" class="rounded-md border border-dashed border-neutral-300 px-3 py-4 text-sm text-neutral-500">
          No social links. Click "Add" to create one.
        </div>

        <div v-for="(social, index) in socials" :key="index" class="mb-3 rounded-md border border-neutral-200 p-3">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-xs font-medium text-neutral-500">#{{ index + 1 }}</span>
            <div class="flex items-center gap-1">
              <button type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30"
                :disabled="index === 0" title="Move up" @click="moveSocial(index, -1)">
                <Icon name="lucide:chevron-up" class="h-4 w-4" />
              </button>
              <button type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30"
                :disabled="index === socials.length - 1" title="Move down" @click="moveSocial(index, 1)">
                <Icon name="lucide:chevron-down" class="h-4 w-4" />
              </button>
              <button type="button"
                class="inline-flex h-7 w-7 items-center justify-center rounded text-red-600 hover:bg-red-50"
                title="Remove" @click="removeSocial(index)">
                <Icon name="lucide:trash-2" class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input v-model="social.name" type="text" placeholder="Name (GitHub)"
              class="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none">
            <input v-model="social.url" type="text" placeholder="URL"
              class="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none">
            <input v-model="social.icon" type="text" placeholder="Icon (simple-icons:github)"
              class="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none">
          </div>
        </div>
      </div>

      <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ error }}
      </p>
      <p v-if="saved" class="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
        Saved successfully.
      </p>

      <div class="flex gap-2 pt-2">
        <button type="submit" :disabled="saving"
          class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>
