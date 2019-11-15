import io from 'socket.io-client'
import { Plugin } from '@nuxt/types'

declare global {
  interface Window {
    $socket: SocketIOClient.Socket
  }
}

const plugin: Plugin = (_, inject) => {
  checkForToken(inject)
  window.addEventListener('connect', () => checkForToken(inject))
}

const checkForToken = (inject: (key: string, value: any) => void) => {
  const token = localStorage.getItem('auth._token.local')

  if (token !== 'false' && token) {
    connect(token, inject)
  }
}

const connect = (token: string, inject: (key: string, value: any) => void) => {
  const socket = io({
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        },
      },
    },
  })
  window.$socket = socket
}

export default plugin