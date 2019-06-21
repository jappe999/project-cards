import { GameJoin } from '~/models/Game'
import socket from '~/plugins/socket.io'

export const state = {}
export const getters = {}
export const mutations = {}
export const actions = {
  joinGame(game: GameJoin) {
    socket.emit(`session-join`, game)
  },
}
