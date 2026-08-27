import { profile } from '~/data/profile'
import type { Profile } from '~/types'

export function useProfile() {
  const profileData = ref<Profile>(profile)

  return {
    profile: profileData,
  }
}
