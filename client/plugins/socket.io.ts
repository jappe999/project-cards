import io from 'socket.io-client'
import { Context } from '@nuxt/vue-app'

const socket = io()

export default (ctx: Context, inject: Function) => {
  inject('socket', socket)
}
