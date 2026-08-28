<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data, refresh } = await useFetch('/api/projects')

async function deleteProject(id: number) {
  if (!confirm('Are you sure?')) return
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Projects</h1>
      <NuxtLink to="/admin/projects/create"
        class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
        New Project
      </NuxtLink>
    </div>

    <div class="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table class="w-full text-sm text-left">
        <thead class="bg-neutral-50 text-neutral-700">
          <tr>
            <th class="px-4 py-3 font-medium">Name</th>
            <th class="px-4 py-3 font-medium">URL</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-for="project in data?.data" :key="project.id">
            <td class="px-4 py-3">{{ project.name }}</td>
            <td class="px-4 py-3">{{ project.url }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <NuxtLink :to="`/admin/projects/${project.id}`" class="text-blue-600 hover:underline">Edit</NuxtLink>
              <button class="text-red-600 hover:underline" @click="deleteProject(project.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
