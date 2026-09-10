import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/icon', '@nuxtjs/turnstile'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: ['~/assets/css/main.css'],
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
  },
  runtimeConfig: {
    turnstile: {
      // Use real secret key in production via NUXT_TURNSTILE_SECRET_KEY.
      // Falls back to Turnstile test secret key for local dev.
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
    },
  },
  // Allow external access (Docker/tunnel) and fix HMR through reverse proxy
  devServer: {
    host: process.env.NUXT_DEV_HOST || '0.0.0.0',
    port: Number(process.env.NUXT_DEV_PORT) || 3000,
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: [
        'localhost',
        'dev-1.ngthanhvu.com',
        // common tunnel domains
        '.ngrok-free.app',
        '.ngrok.io',
        '.ngrok.app',
        '.trycloudflare.com',
      ],
      // Trust the X-Forwarded-* headers from reverse proxy/tunnel
      hmr: process.env.DEV_TUNNEL_HOST
        ? {
            host: process.env.DEV_TUNNEL_HOST,
            protocol: 'wss',
            clientPort: 443,
          }
        : true,
    },
    plugins: [tailwindcss()],
  },
})
