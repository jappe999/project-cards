import io from 'socket.io-client'
import { Context } from '@nuxt/vue-app'

export default (ctx: Context, inject: Function) => {
  const socket = io({
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: localStorage.getItem('auth._token.local'),
        },
      },
    },
  })
  inject('socket', socket)
}
