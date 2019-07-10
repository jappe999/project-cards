import { GameView } from '~/models/Game'

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  join(state: any, game: GameView) {
    this.$socket.emit('session-join', game)
  },

  exit(state: any, game: GameView) {
    this.$socket.emit('session-exit', game)
  },
}
