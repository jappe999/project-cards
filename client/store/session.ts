import * as types from './mutation-types'
import { SessionView } from '../models/Session'
import { CardView } from '../models/Card'
import { GameView } from '../models/Game'

type state = {
  session: SessionView
  cards: CardView[]
}

//@ts-ignore
const socket: SocketIOClient.Socket = window.$socket

export const state = (): state => ({
  session: null,
  cards: [],
})

export const getters = {
  session: ({ session }): SessionView => session,
  cards: ({ cards }): CardView[] => cards,
  blackCard: ({ session }): CardView => (session && session.currentCard) || {},
  round: ({ session }): number => (session && session.currentRound) || 0,
}

export const mutations = {
  [types.UPDATE_SESSION](state: state, session: Partial<SessionView>): void {
    state.session = {
      ...state.session,
      ...session,
    }
  },

  [types.CLEAR_SESSION](state: state): void {
    state.session = null
  },
}

export const actions = {
  /**
   * Emit a message to join a game session.
   */
  joinGame({ commit }, game: GameView) {
    socket.emit('session-join', { game })
    commit(types.UPDATE_SESSION, game)
  },

  /**
   * Emit a message to exit a game session.
   */
  exitGame({ commit }, game: GameView) {
    socket.emit('session-exit', { game })
    commit(types.CLEAR_SESSION)
  },
}
