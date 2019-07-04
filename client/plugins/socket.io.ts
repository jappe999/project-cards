import io from 'socket.io-client'

const socket = io(<string>process.env.WS_URL)

export default socket
