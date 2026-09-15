<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Projects | Admin',
})

const { data, refresh } = await useFetch('/api/projects')

const selected = ref<Set<number>>(new Set())

const projects = computed(() => data.value?.data || [])

const { page, pageSize, pageCount, paginated, goTo } = usePagination(projects)

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
  <div class="w-full">
    <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          Projects
        </h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Manage the projects shown on the homepage.
        </p>
      </div>
      <NuxtLink to="/admin/projects/create" title="Create project"
        class="inline-flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-background transition-opacity hover:opacity-90">
        <Icon name="lucide:plus" class="h-4 w-4" />
      </NuxtLink>
    </header>

    <div v-if="selected.size > 0"
      class="mb-4 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2">
      <Icon name="lucide:check-square" class="h-4 w-4 text-red-600" />
      <span class="text-sm font-medium text-red-700">{{ selected.size }} selected</span>
      <button
        class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-100 text-red-700 transition-colors hover:bg-red-200"
        title="Delete selected" @click="deleteSelected">
        <Icon name="lucide:trash-2" class="h-4 w-4" />
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg border border-border bg-card">
      <table class="w-full min-w-160 text-sm">
        <thead
          class="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <tr>
            <th class="w-10 px-4 py-3 text-center">
              <input v-model="allSelected" type="checkbox" class="h-4 w-4 rounded border-border">
            </th>
            <th class="w-16 px-4 py-3 text-center">
              STT
            </th>
            <th class="px-4 py-3 text-center">
              Name
            </th>
            <th class="px-4 py-3 text-center">
              URL
            </th>
            <th class="w-24 px-4 py-3 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr v-if="!projects.length">
            <td colspan="5" class="px-4 py-12 text-center text-muted-foreground">
              No projects found.
            </td>
          </tr>
          <tr v-for="(project, index) in paginated" :key="project.id" class="transition-colors hover:bg-muted/30">
            <td class="px-4 py-3 text-center">
              <input :checked="selected.has(project.id)" type="checkbox" class="h-4 w-4 rounded border-border"
                @change="toggleRow(project.id)">
            </td>
            <td class="px-4 py-3 text-center text-muted-foreground">
              {{ (page - 1) * pageSize + index + 1 }}
            </td>
            <td class="px-4 py-3 text-center font-medium text-foreground">
              {{ project.name }}
            </td>
            <td class="px-4 py-3 text-center">
              <a :href="project.url" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                <span class="max-w-70 truncate">{{ project.url }}</span>
                <Icon name="lucide:external-link" class="h-3.5 w-3.5 shrink-0" />
              </a>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-center gap-1">
                <NuxtLink :to="`/admin/projects/${project.id}`"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  title="Edit">
                  <Icon name="lucide:pencil" class="h-4 w-4" />
                </NuxtLink>
                <button
                  class="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
                  title="Delete" @click="deleteProject(project.id)">
                  <Icon name="lucide:trash-2" class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination :page="page" :page-count="pageCount" :total="projects.length" :page-size="pageSize"
      @update:page="goTo" />
  </div>
</template>
