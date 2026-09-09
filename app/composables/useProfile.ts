import type { Profile, SocialLink } from '~/types'

export interface ApiProfile {
  id: number
  name: string
  nickname: string
  tagline: string | null
  bio: string | null
  avatar: string | null
  email: string | null
  startDate: string | null
}

export interface ApiSocialLink {
  id: number
  name: string
  url: string
  icon: string
  displayOrder: number
}

interface ProfileResponse {
  profile: ApiProfile | null
  socials: ApiSocialLink[]
}

const EMPTY_PROFILE: Profile = {
  name: '',
  nickname: '',
  tagline: '',
  bio: '',
  avatar: '',
  email: '',
  startDate: '',
  socials: [],
}

export function useProfile() {
  const { data: profile, pending: loading, error, refresh: fetchProfile } = useAsyncData(
    'profile',
    async () => {
      const data = await $fetch<ProfileResponse>('/api/profile')

      const apiProfile = data.profile

      if (!apiProfile) return EMPTY_PROFILE

      const socials: SocialLink[] = data.socials.map((link) => ({
        name: link.name,
        url: link.url,
        icon: link.icon,
      }))

      return {
        name: apiProfile.name,
        nickname: apiProfile.nickname,
        tagline: apiProfile.tagline || '',
        bio: apiProfile.bio || '',
        avatar: apiProfile.avatar || '',
        email: apiProfile.email || '',
        startDate: apiProfile.startDate || '',
        socials,
      }
    },
    { default: () => ({ ...EMPTY_PROFILE }) },
  )

  return {
    profile,
    loading,
    error,
    fetchProfile,
  }
}
