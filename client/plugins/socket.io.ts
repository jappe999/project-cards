import io from 'socket.io-client'

export default () => {
  checkForToken()
  window.addEventListener('connect', () => checkForToken())
}

const checkForToken = () => {
  const token = localStorage.getItem('auth._token.local')

  if (token !== 'false' && token) {
    connect(token)
  }
}

const connect = (token: string) => {
  const socket = io({
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        },
      },
    },
  })
  window['$socket'] = socket
}
