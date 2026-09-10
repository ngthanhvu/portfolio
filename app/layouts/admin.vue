<script setup lang="ts">
const collapsed = useState<boolean>('admin-sidebar-collapsed', () => false)
const route = useRoute()

const { data: authData } = await useFetch('/api/auth/me', {
  credentials: 'include',
})

const user = computed(() => authData.value?.user)

const initials = computed(() => {
  if (!user.value?.name) return 'A'
  return user.value.name.charAt(0).toUpperCase()
})

const links = [
  { name: 'Dashboard', path: '/admin', icon: 'lucide:layout-dashboard', exact: true },
  { name: 'Posts', path: '/admin/posts', icon: 'lucide:file-text' },
  { name: 'Projects', path: '/admin/projects', icon: 'lucide:folder' },
  { name: 'Users', path: '/admin/users', icon: 'lucide:users' },
]

const otherLinks = [
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
  <div class="min-h-screen bg-background text-foreground">
    <aside class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300"
      :class="collapsed ? 'w-16' : 'w-64'">
      <!-- Header -->
      <div class="flex h-16 shrink-0 items-center border-b border-border px-4"
        :class="collapsed ? 'justify-center' : 'justify-between'">
        <NuxtLink v-if="!collapsed" to="/admin" class="flex min-w-0 flex-1 items-center gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
            <Icon name="lucide:layout-grid" class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-foreground">
              Portfolio Admin
            </p>
            <p class="truncate text-xs text-muted-foreground">
              Dashboard
            </p>
          </div>
        </NuxtLink>

        <button
          class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          :class="collapsed ? 'ml-0' : 'ml-2'" :title="collapsed ? 'Expand' : 'Collapse'"
          @click="collapsed = !collapsed">
          <Icon :name="collapsed ? 'lucide:panel-right' : 'lucide:panel-left'" class="h-4 w-4" />
        </button>
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto py-4">
        <div v-if="!collapsed" class="px-4 pb-2 pt-1 text-xs font-bold tracking-wider text-muted-foreground">
          General
        </div>
        <nav class="space-y-1 px-2">
          <NuxtLink v-for="link in links" :key="link.path" :to="link.path"
            class="flex items-center rounded-md py-2 text-sm font-semibold transition-colors" :class="[
              collapsed ? 'justify-center px-2' : 'gap-3 px-3',
              isActive(link.path, link.exact)
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            ]" :title="collapsed ? link.name : undefined">
            <Icon :name="link.icon" class="h-4 w-4 shrink-0" />
            <span v-if="!collapsed" class="truncate">{{ link.name }}</span>
          </NuxtLink>
        </nav>

        <div v-if="!collapsed" class="mt-6 px-4 pb-2 pt-1 text-xs font-bold tracking-wider text-muted-foreground">
          Other
        </div>
        <nav class="space-y-1 px-2">
          <NuxtLink v-for="link in otherLinks" :key="link.path" :to="link.path"
            class="flex items-center rounded-md py-2 text-sm font-semibold transition-colors" :class="[
              collapsed ? 'justify-center px-2' : 'gap-3 px-3',
              isActive(link.path, link.exact)
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            ]" :title="collapsed ? link.name : undefined">
            <Icon :name="link.icon" class="h-4 w-4 shrink-0" />
            <span v-if="!collapsed" class="truncate">{{ link.name }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- User profile -->
      <div class="shrink-0 border-t border-border p-3">
        <div v-if="!collapsed" class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50">
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
            {{ initials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-foreground">
              {{ user?.name || 'Admin' }}
            </p>
            <p class="truncate text-xs text-muted-foreground">
              {{ user?.email || '' }}
            </p>
          </div>
          <NuxtLink to="/" external
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="View website">
            <Icon name="lucide:external-link" class="h-4 w-4" />
          </NuxtLink>
          <button
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-accent hover:text-red-500 cursor-pointer"
            title="Logout" @click="logout">
            <Icon name="lucide:log-out" class="h-4 w-4" />
          </button>
        </div>

        <div v-else class="flex flex-col items-center gap-2">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground"
            :title="user?.name || 'Admin'">
            {{ initials }}
          </div>
          <NuxtLink to="/" external
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="View website">
            <Icon name="lucide:external-link" class="h-3.5 w-3.5" />
          </NuxtLink>
          <button
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Logout" @click="logout">
            <Icon name="lucide:log-out" class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>

    <main class="transition-all duration-300" :class="collapsed ? 'pl-16' : 'pl-64'">
      <div class="p-4">
        <slot />
      </div>
    </main>
  </div>
</template>
