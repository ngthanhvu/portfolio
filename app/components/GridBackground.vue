<template>
  <div class="pointer-events-none absolute inset-0 -z-10 flex overflow-hidden">
    <!-- Left grid -->
    <div class="relative flex h-full w-1/2 flex-col">
      <div class="absolute inset-0 z-30 bg-linear-to-tr from-background from-50% via-transparent via-90% to-transparent to-100%" />
      <div class="flex h-full flex-col divide-y divide-zinc-800/50 border-t border-l border-zinc-800/50">
        <div v-for="row in 12" :key="`l-${row}`" class="flex flex-1 divide-x divide-zinc-800/50">
          <div v-for="col in 9" :key="`l-${row}-${col}`" class="h-full w-full" />
        </div>
      </div>
    </div>

    <!-- Right grid -->
    <div class="relative flex h-full w-1/2 flex-col">
      <div class="absolute inset-0 z-30 bg-linear-to-tl from-background from-50% via-transparent via-90% to-transparent to-100%" />
      <div class="flex h-full flex-col divide-y divide-zinc-800/50 border-t border-l border-zinc-800/50">
        <div v-for="row in 12" :key="`r-${row}`" class="flex flex-1 divide-x divide-zinc-800/50">
          <div v-for="col in 9" :key="`r-${row}-${col}`" class="h-full w-full" />
        </div>
      </div>
    </div>
  </div>
</template>
