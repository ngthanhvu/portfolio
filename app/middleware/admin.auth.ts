export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    try {
      const { user } = await $fetch<{ user: any }>('/api/auth/me', {
        credentials: 'include',
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
