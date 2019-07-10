import NuxtConfiguration from '@nuxt/config'

const isDev = process.env.NODE_ENV !== 'production'

const config: NuxtConfiguration = {
  mode: 'spa',
  env: {
    port: process.env.PORT || '3100',
  },

  srcDir: './client/',
  dev: isDev,

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
  plugins: [
    '~/plugins/Form',
    '~/plugins/SelectOnFocus',
    { src: '~/plugins/socket.io', ssr: false },
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  devModules: ['@nuxtjs/eslint-module'],
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
    dev: !isDev,
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
