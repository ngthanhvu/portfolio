<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data, refresh } = await useFetch('/api/projects')

const selected = ref<Set<number>>(new Set())

const projects = computed(() => data.value?.data || [])

const allSelected = computed({
  get: () => projects.value.length > 0 && projects.value.every((p) => selected.value.has(p.id)),
  set: (value: boolean) => {
    selected.value = new Set(value ? projects.value.map((p) => p.id) : [])
  },
})

function toggleRow(id: number) {
  const newSet = new Set(selected.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  }
  else {
    newSet.add(id)
  }
  selected.value = newSet
}

async function deleteProject(id: number) {
  if (!confirm('Are you sure?')) return
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  refresh()
}

async function deleteSelected() {
  if (!confirm(`Delete ${selected.value.size} projects?`)) return
  await Promise.all(Array.from(selected.value).map((id) => $fetch(`/api/projects/${id}`, { method: 'DELETE' })))
  selected.value = new Set()
  refresh()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Projects</h1>
      <NuxtLink to="/admin/projects/create"
        class="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 cursor-pointer">
        <Icon name="lucide:plus" class="h-4 w-4 mr-2" />
        Create
      </NuxtLink>
    </div>

    <div v-if="selected.size > 0" class="mb-4 flex items-center gap-3">
      <span class="text-sm text-neutral-600">{{ selected.size }} selected</span>
      <button
        class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
        @click="deleteSelected">
        <Icon name="lucide:trash-2" class="h-4 w-4" />
      </button>
    </div>

    <div class="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <table class="w-full text-sm text-center">
        <thead class="bg-neutral-50 text-neutral-700">
          <tr>
            <th class="px-4 py-3 w-10">
              <input v-model="allSelected" type="checkbox" class="h-4 w-4 rounded border-neutral-300" />
            </th>
            <th class="px-4 py-3 font-medium w-16">STT</th>
            <th class="px-4 py-3 font-medium">Name</th>
            <th class="px-4 py-3 font-medium">URL</th>
            <th class="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200">
          <tr v-if="!projects.length">
            <td colspan="5" class="px-4 py-8 text-neutral-500">
              No projects found.
            </td>
          </tr>
          <tr v-for="(project, index) in projects" :key="project.id">
            <td class="px-4 py-3">
              <input :checked="selected.has(project.id)" type="checkbox" class="h-4 w-4 rounded border-neutral-300"
                @change="toggleRow(project.id)" />
            </td>
            <td class="px-4 py-3 text-neutral-500">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ project.name }}</td>
            <td class="px-4 py-3">{{ project.url }}</td>
            <td class="px-4 py-3">
              <div class="inline-flex items-center gap-2">
                <NuxtLink :to="`/admin/projects/${project.id}`"
                  class="inline-flex items-center rounded-md bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </NuxtLink>
                <button class="inline-flex items-center rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                  @click="deleteProject(project.id)">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
