import { defineNuxtConfig } from 'nuxt/config'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  vite: {
    plugins: [
      vanillaExtractPlugin({})
    ],
  },
  // Note currently server side rendering seems to break hmr (hot module reloading) with Nuxt
  // One workaround is to instead bundle the vue components into a seperate vite built library
  // Or disable SSR while developing components
  ssr: false,
})
