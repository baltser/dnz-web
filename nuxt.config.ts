export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
  //  '@prisma/nuxt'
  ],
  // nitro: {
  //   esbuild: {
  //     options: { target: 'es2022' }
  //   }
  // },
})
