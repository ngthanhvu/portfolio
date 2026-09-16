<script setup lang="ts">
definePageMeta({
  layout: false,
})

const turnstileEnabled = !!useRuntimeConfig().public.turnstile?.siteKey
const turnstileToken = ref('')
const turnstileRef = ref<{ reset: () => void } | null>(null)

const form = reactive({
  email: '',
  password: '',
})

const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        ...form,
        'cf-turnstile-response': turnstileToken.value,
      },
    })
    await navigateTo('/admin')
  }
  catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Login failed'
    turnstileRef.value?.reset()
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
    <div class="w-full max-w-sm">
      <div class="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
            <Icon name="lucide:lock" class="h-6 w-6 text-white" />
          </div>
          <h1 class="text-xl font-bold text-neutral-900">
            Admin Login
          </h1>
          <p class="mt-1 text-sm text-neutral-500">
            Sign in to your admin account
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="admin@example.com"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 transition duration-300 ease shadow-sm focus:outline-none focus:border-slate-400 hover:border-slate-300"
            >
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 transition duration-300 ease shadow-sm focus:outline-none focus:border-slate-400 hover:border-slate-300"
            >
          </div>

          <NuxtTurnstile
            v-if="turnstileEnabled"
            ref="turnstileRef"
            v-model="turnstileToken"
            class="min-h-[65px]"
          />

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading || (turnstileEnabled && !turnstileToken)"
            class="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
