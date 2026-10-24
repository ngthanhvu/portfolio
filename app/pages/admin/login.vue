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
  <div class="relative flex min-h-screen items-center justify-center bg-black p-5">
    <GridBackground />

    <div class="relative z-20 w-full max-w-sm">
      <form class="border border-zinc-800 bg-zinc-950 p-7" @submit.prevent="onSubmit">
        <!-- Header -->
        <div class="mb-6 flex flex-col items-center text-center">
          <div
            class="mb-4 flex size-10 items-center justify-center border border-sky-500/40 bg-sky-500/10 text-sky-300">
            <Icon name="lucide:lock-keyhole" class="size-5" />
          </div>

          <h1 class="m-0 text-center text-lg font-bold text-white">Admin Login</h1>

          <p class="label-mono mt-1.5 text-center text-[12px] text-zinc-500">
            Sign in to your admin account
          </p>
        </div>

        <!-- Email -->
        <label class="mb-4 block">
          <span class="label-mono block text-[11px] text-zinc-500">Email</span>
          <input id="email" v-model="form.email" type="email" required autocomplete="email"
            placeholder="admin@example.com" spellcheck="false"
            class="mt-1.5 w-full border border-zinc-800 bg-black px-3 py-2 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400">
        </label>

        <!-- Password -->
        <label class="mb-6 block">
          <span class="label-mono block text-[11px] text-zinc-500">Password</span>
          <input id="password" v-model="form.password" type="password" required autocomplete="current-password"
            placeholder="••••••••"
            class="mt-1.5 w-full border border-zinc-800 bg-black px-3 py-2 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-zinc-600 focus:border-zinc-400">
        </label>

        <!-- Error -->
        <div v-if="error" class="label-mono mb-4 border border-red-500/40 bg-red-500/10 px-3 py-2 text-[12px] text-red-400">
          {{ error }}
        </div>

        <!-- Button -->
        <button type="submit" :disabled="loading"
          class="label-mono w-full select-none border border-sky-500/40 bg-sky-500/10 py-2.5 text-[12.5px] font-medium text-sky-300 transition-colors duration-150 hover:border-sky-400 hover:bg-sky-500/20 hover:text-sky-100 active:bg-sky-500/30 disabled:pointer-events-none disabled:opacity-40">
          <Icon v-if="loading" name="lucide:loader-circle" class="mr-2 inline size-4 animate-spin" />
          {{ loading ? 'Signing in…' : 'Continue' }}
        </button>
      </form>
    </div>
  </div>
</template>
