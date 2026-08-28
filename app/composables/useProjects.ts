import type { Project } from '~/types'

export interface ApiProject {
  id: number
  name: string
  description: string
  image: string | null
  url: string
  createdAt: string
}

function mapProject(project: ApiProject): Project {
  return {
    id: String(project.id),
    name: project.name,
    description: project.description,
    image: project.image || '',
    url: project.url,
    tags: [],
  }
}

export function useProjects() {
  const allProjects = ref<Project[]>([])
  const loading = ref(false)

  async function fetchProjects() {
    loading.value = true
    try {
      const { data } = await $fetch<{ data: ApiProject[] }>('/api/projects')
      allProjects.value = data.map(mapProject)
    }
    finally {
      loading.value = false
    }
  }

  return {
    allProjects,
    loading,
    fetchProjects,
  }
}
