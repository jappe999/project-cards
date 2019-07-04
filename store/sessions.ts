import { GameView } from '~/models/Game'
import socket from '~/plugins/socket.io'

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  join(state: any, game: GameView) {
    socket.emit('session-join', game)
  },

  exit(state: any, game: GameView) {
    socket.emit('session-exit', game)
  },
}
