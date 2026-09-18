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
      <div class="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <!-- Header -->
        <div class="mb-6 flex flex-col items-center text-center">
          <div
            class="mb-4 flex size-10 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm">
            <Icon name="lucide:lock-keyhole" class="size-5 text-neutral-900" />
          </div>

          <h1 class="text-2xl font-semibold tracking-tight text-neutral-950">
            Admin Login
          </h1>

          <p class="mt-1.5 text-sm text-neutral-500">
            Sign in to your admin account
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-neutral-900">
              Email
            </label>

            <input id="email" v-model="form.email" type="email" required autocomplete="email"
              placeholder="admin@example.com" class="
                flex h-10 w-full rounded-md
                border border-neutral-200
                bg-white px-3 py-2
                text-sm text-neutral-900
                shadow-sm
                outline-none
                transition-all
                placeholder:text-neutral-400
                hover:border-neutral-300
                focus:border-neutral-400
                focus:ring-2
                focus:ring-neutral-950/10
              ">
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-neutral-900">
              Password
            </label>

            <input id="password" v-model="form.password" type="password" required autocomplete="current-password"
              placeholder="••••••••" class="
                flex h-10 w-full rounded-md
                border border-neutral-200
                bg-white px-3 py-2
                text-sm text-neutral-900
                shadow-sm
                outline-none
                transition-all
                placeholder:text-neutral-400
                hover:border-neutral-300
                focus:border-neutral-400
                focus:ring-2
                focus:ring-neutral-950/10
              ">
          </div>

          <!-- Error -->
          <div v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ error }}
          </div>

          <!-- Button -->
          <button type="submit" :disabled="loading" class="
              inline-flex h-10 w-full
              items-center justify-center
              rounded-md
              bg-neutral-900
              px-4
              text-sm font-medium
              text-white
              shadow-sm
              transition-colors
              hover:bg-neutral-800
              focus:outline-none
              focus:ring-2
              focus:ring-neutral-950/20
              focus:ring-offset-2
              disabled:pointer-events-none
              disabled:opacity-50
            ">
            <Icon v-if="loading" name="lucide:loader-circle" class="mr-2 size-4 animate-spin" />

            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>