<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <AppHeader />
    <main class="flex-1 pt-12">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
