<script setup lang="ts">
const { profile } = useProfile()

useHead({
  title: `About | ${profile.value.name}`,
})
</script>

<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <div class="mx-auto max-w-3xl">
        <div class="mb-8 text-center">
          <div class="mb-6 inline-flex h-32 w-32 overflow-hidden rounded-full border-2 border-border">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="h-full w-full object-cover"
            />
          </div>
          <Badge class="mb-4">About</Badge>
          <h1 class="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            {{ profile.name }}
          </h1>
          <p class="text-lg text-muted-foreground">
            {{ profile.tagline }}
          </p>
        </div>

        <div class="rounded-lg border border-border bg-card p-8">
          <h2 class="mb-4 text-2xl font-bold text-card-foreground">Hello</h2>
          <p class="mb-6 leading-relaxed text-card-foreground">
            {{ profile.bio }}
          </p>

          <h3 class="mb-3 text-lg font-semibold text-card-foreground">Connect</h3>
          <div class="flex flex-wrap gap-3">
            <a
              v-for="social in profile.socials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Icon :name="social.icon" class="h-4 w-4" />
              {{ social.name }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
