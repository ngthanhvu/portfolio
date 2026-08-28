<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const { data: project } = await useFetch(`/api/projects/${id}`)

const error = ref('')

async function onSubmit() {
  if (!project.value) return

  try {
    await $fetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: project.value,
    })
    router.push('/admin/projects')
  }
  catch (err: any) {
    error.value = err?.message || 'Failed to update project'
  }
}
</script>

<template>
  <div v-if="project">
    <h1 class="text-2xl font-bold mb-6">Edit Project</h1>

    <form class="max-w-2xl space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input v-model="project.name" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="project.description" rows="3" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Image URL</label>
        <input v-model="project.image" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">URL</label>
        <input v-model="project.url" type="text" class="w-full rounded-md border border-neutral-300 px-3 py-2" required />
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <div class="flex gap-2">
        <button type="submit" class="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800">Update</button>
        <NuxtLink to="/admin/projects" class="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>
