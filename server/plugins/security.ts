import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (_response, { event }) => {
    setResponseHeader(event, 'X-Frame-Options', 'DENY')
    setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
    setResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
    setResponseHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  })
})
