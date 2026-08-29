export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}
      const { user } = await $fetch<{ user: any }>('/api/auth/me', {
        credentials: 'include',
        headers,
      })

      if (!user || user.role !== 'admin') {
        return navigateTo('/admin/login')
      }
    }
    catch {
      return navigateTo('/admin/login')
    }
  }
})
