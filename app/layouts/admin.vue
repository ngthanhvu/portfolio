<script setup lang="ts">
const links = [
  { name: 'Dashboard', path: '/admin', icon: 'lucide:layout-dashboard' },
  { name: 'Posts', path: '/admin/posts', icon: 'lucide:file-text' },
  { name: 'Projects', path: '/admin/projects', icon: 'lucide:folder' },
  { name: 'Comments', path: '/admin/comments', icon: 'lucide:message-circle' },
  { name: 'Settings', path: '/admin/settings', icon: 'lucide:settings' },
]
</script>

<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900">
    <aside class="fixed inset-y-0 left-0 w-64 border-r border-neutral-200 bg-white">
      <div class="flex h-16 items-center px-6 border-b border-neutral-200">
        <NuxtLink to="/" class="font-bold text-lg">
          Admin
        </NuxtLink>
      </div>

      <nav class="p-4 space-y-1">
        <NuxtLink v-for="link in links" :key="link.path" :to="link.path"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100"
          active-class="bg-neutral-100 text-neutral-900">
          <Icon :name="link.icon" class="h-4 w-4" />
          {{ link.name }}
        </NuxtLink>
      </nav>
    </aside>

    <main class="pl-64">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
