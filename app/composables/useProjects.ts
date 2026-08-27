import { projects } from '~/data/projects'
import type { Project } from '~/types'

export function useProjects() {
  const allProjects = ref<Project[]>(projects)

  return {
    allProjects,
  }
}
