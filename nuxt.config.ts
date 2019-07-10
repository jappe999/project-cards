import NuxtConfiguration from '@nuxt/config'

const config: NuxtConfiguration = {
  mode: 'spa',
  env: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || '3100',
    WS_URL: process.env.WS_URL || 'http://localhost:3100',
  },

  srcDir: './client/',
  dev: process.env.NODE_ENV !== 'production',

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false, //{ color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/tailwind.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/Form', '~/plugins/SelectOnFocus'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3100,
    prefix: '/api/',
  },
  workbox: {
    dev: process.env.NODE_ENV !== 'production',
  },
  /*
   ** Build configuration
   */
  build: {
    cache: true,
    babel: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
    postcss: {
      plugins: {
        tailwindcss: './client/tailwind.config.js',
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}

export default config
