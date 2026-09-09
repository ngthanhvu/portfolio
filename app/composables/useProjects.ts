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
  const { data: allProjects, pending: loading, error, refresh: fetchProjects } = useAsyncData(
    'projects',
    () => $fetch<{ data: ApiProject[] }>('/api/projects').then(r => r.data.map(mapProject)),
    { default: () => [] as Project[] },
  )

  return {
    allProjects,
    loading,
    error,
    fetchProjects,
  }
}
