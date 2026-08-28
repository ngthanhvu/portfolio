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

export function useProfile() {
  const profile = ref<Profile>({
    name: '',
    nickname: '',
    tagline: '',
    bio: '',
    avatar: '',
    email: '',
    startDate: '',
    socials: [],
  })
  const loading = ref(false)

  async function fetchProfile() {
    loading.value = true
    try {
      const data = await $fetch<{ profile: ApiProfile | null; socials: ApiSocialLink[] }>('/api/profile')

      const apiProfile = data.profile

      if (!apiProfile) {
        profile.value = null
        return
      }

      const socials: SocialLink[] = data.socials.map((link) => ({
        name: link.name,
        url: link.url,
        icon: link.icon,
      }))

      profile.value = {
        name: apiProfile.name,
        nickname: apiProfile.nickname,
        tagline: apiProfile.tagline || '',
        bio: apiProfile.bio || '',
        avatar: apiProfile.avatar || '',
        email: apiProfile.email || '',
        startDate: apiProfile.startDate || '',
        socials,
      }
    }
    finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    fetchProfile,
  }
}
