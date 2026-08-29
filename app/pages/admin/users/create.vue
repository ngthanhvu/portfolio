<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const router = useRouter()

const form = reactive({
  name: '',
  nickname: '',
  email: '',
  password: '',
  avatar: '',
  role: 'author',
})

const error = ref('')

async function onSubmit() {
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
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Create User</h1>

    <form class="max-w-2xl space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input v-model="form.name" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Nickname</label>
        <input v-model="form.nickname" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input v-model="form.email" type="email" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Password</label>
        <input v-model="form.password" type="password" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Avatar URL</label>
        <input v-model="form.avatar" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Role</label>
        <select v-model="form.role" class="w-full rounded-md border border-neutral-300 px-3 py-2">
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <div class="flex gap-2">
        <button type="submit" class="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800">Create</button>
        <NuxtLink to="/admin/users" class="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>
