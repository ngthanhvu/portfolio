<script setup lang="ts">
const collapsed = ref(false)
const route = useRoute()

const links = [
  { name: 'Dashboard', path: '/admin', icon: 'lucide:layout-dashboard', exact: true },
  { name: 'Posts', path: '/admin/posts', icon: 'lucide:file-text' },
  { name: 'Projects', path: '/admin/projects', icon: 'lucide:folder' },
  { name: 'Users', path: '/admin/users', icon: 'lucide:users' },
  { name: 'Settings', path: '/admin/settings', icon: 'lucide:settings' },
]

function isActive(path: string, exact?: boolean) {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  if (import.meta.client) {
    window.location.href = '/admin/login'
  }
  else {
    await navigateTo('/admin/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900">
    <aside class="fixed inset-y-0 left-0 z-40 border-r border-neutral-200 bg-white transition-all duration-300"
      :class="collapsed ? 'w-16' : 'w-64'">
      <div class="flex h-16 items-center border-neutral-200 px-2 transition-all duration-300"
        :class="collapsed ? 'justify-center' : 'justify-between px-4'">
        <NuxtLink v-show="!collapsed" to="/" class="font-bold text-lg truncate">
          Admin
        </NuxtLink>
        <button class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100 shrink-0 cursor-pointer"
          @click="collapsed = !collapsed">
          <Icon :name="collapsed ? 'lucide:panel-right' : 'lucide:panel-left'" class="h-4 w-4" />
        </button>
      </div>

      <nav class="p-2 space-y-1">
        <NuxtLink v-for="link in links" :key="link.path" :to="link.path"
          class="flex items-center rounded-md py-2 text-sm font-medium transition-colors whitespace-nowrap overflow-hidden"
          :class="[
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            isActive(link.path, link.exact) ? 'bg-neutral-100 text-neutral-900' : 'hover:bg-neutral-100'
          ]" :title="collapsed ? link.name : undefined">
          <Icon :name="link.icon" class="h-4 w-4 shrink-0" />
          <span v-show="!collapsed">{{ link.name }}</span>
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-2">
        <button
          class="flex w-full items-center rounded-md py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          :class="collapsed ? 'justify-center px-0' : 'gap-3 px-3'" :title="collapsed ? 'Logout' : undefined"
          @click="logout">
          <Icon name="lucide:log-out" class="h-4 w-4 shrink-0" />
          <span v-show="!collapsed">Logout</span>
        </button>
      </div>
    </aside>

    <main class="transition-all duration-300" :class="collapsed ? 'pl-16' : 'pl-64'">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>