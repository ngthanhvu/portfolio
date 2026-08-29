<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { data: user } = await useFetch(`/api/users/${id}`)

const newPassword = ref('')
const error = ref('')

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
}
</script>

<template>
  <div v-if="user">
    <h1 class="text-2xl font-bold mb-6">Edit User</h1>

    <form class="max-w-2xl space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input v-model="user.name" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Nickname</label>
        <input v-model="user.nickname" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input v-model="user.email" type="email" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">New Password <span class="text-neutral-400">(leave blank to keep)</span></label>
        <input v-model="newPassword" type="password" class="w-full rounded-md border border-neutral-300 px-3 py-2" placeholder="••••••••" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Avatar URL</label>
        <input v-model="user.avatar" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Role</label>
        <select v-model="user.role" class="w-full rounded-md border border-neutral-300 px-3 py-2">
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <div class="flex gap-2">
        <button type="submit" class="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800">Update</button>
        <NuxtLink to="/admin/users" class="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>
