<script setup lang="ts">
definePageMeta({
  layout: false,
})

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
      body: form,
    })
    await navigateTo('/admin')
  }
  catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Login failed'
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
              class="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-neutral-500 focus:outline-none"
            >
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm focus:border-neutral-500 focus:outline-none"
            >
          </div>

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>

      <p class="mt-4 text-center text-xs text-neutral-400">
        Default: admin@thanhvu.net / admin123
      </p>
    </div>
  </div>
</template>
