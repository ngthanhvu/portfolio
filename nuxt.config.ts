import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/sitemap',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: [
    '~/assets/css/main.css',
  ],
  runtimeConfig: {
    public: {},
  },
  sitemap: {
    siteUrl: process.env.NUXT_SITEMAP_SITE_URL || 'https://ngthanhvu.com',
    exclude: [
      '/admin/**',
      '/admin',
    ],
    sources: [
      '/api/__sitemap__/urls',
    ],
  },
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
        '.ngrok-free.app',
        '.ngrok.io',
        '.ngrok.app',
        '.trycloudflare.com',
      ],
      hmr: process.env.DEV_TUNNEL_HOST
        ? {
          host: process.env.DEV_TUNNEL_HOST,
          protocol: 'wss',
          clientPort: 443,
        }
        : true,
    },

    plugins: [
      tailwindcss(),
    ],
  },
})