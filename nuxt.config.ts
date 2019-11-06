import NuxtConfiguration from '@nuxt/config'

const isDev = process.env.NODE_ENV !== 'production'

const config: NuxtConfiguration = {
  mode: 'spa',
  env: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || '3100',
  },

  srcDir: './client/',
  dev: isDev,

  /*
   ** Headers of the page
   */
  head: {
    title: 'Project Cards',
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
    '~/plugins/vue-click-outside',
    { src: '~/plugins/socket.io', ssr: false },
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
  ],
  devModules: ['@nuxtjs/eslint-module'],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    host: process.env.API_HOST || 'localhost',
    port: process.env.API_PORT || 3100,
    https: true,
    prefix: '/api/',
  },
  workbox: {
    offline: false,
    runtimeCaching: [
      {
        urlPattern: '^(?!.*api.*$).*$',
        handler: 'staleWhileRevalidate',
        method: 'GET',
      },
    ],
  },
  meta: {
    name: 'Project Cards',
    theme_color: '#1a202c',
    mobileAppIOS: true,
  },
  manifest: {
    name: 'Project Cards',
  },
  auth: {
    redirect: {
      home: '/game',
      logout: '/login',
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'auth/login',
            method: 'post',
            propertyName: 'access_token',
          },
          logout: {
            url: 'auth/logout',
            method: 'post',
          },
          user: { url: 'auth/me', method: 'get', propertyName: false },
        },
      },
    },
  },
  router: {
    middleware: ['auth'],
  },
  // serverMiddleware: ['redirect-ssl'],
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
    extend(config, ctx) { },
  },
}

export default config
