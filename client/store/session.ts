import * as types from './mutation-types'
import { SessionView } from '~/models/Session'
import { GameView } from '~/models/Game'
import { PlayerView } from '~/models/Player'
import { CardView } from '~/models/Card'

export type gameState =
  | ''
  | 'choose-cards'
  | 'choose-card-combination'
  | 'show-best-combination'

export type state = {
  session: SessionView
  gameState: gameState
  players: PlayerView[]
}

export const state = (): state => ({
  session: null,
  gameState: '',
  players: [],
})

export const getters = {
  session: ({ session }): SessionView => session || {},
  game: ({ session }): GameView => (session && session.game) || {},
  blackCard: ({ session }): CardView => (session && session.currentCard) || {},
  round: ({ session }): number => (session && session.currentRound) || 0,
  gameState: ({ gameState }): gameState => gameState,
  players: ({ players }): PlayerView[] => players,
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
    state.players = []
    state.gameState = 'choose-cards'
  },

  [types.UPDATE_GAME_STATE](state: state, gameState: gameState): void {
    state.gameState = gameState
  },
}

export const actions = {
  /**
   * Emit a message to join a game session.
   */
  joinSession({ commit }, game: GameView) {
    //@ts-ignore
    window.$socket.emit('session-join', { game })
    commit(types.UPDATE_SESSION, game)
  },

  /**
   * Emit a message to exit a game session.
   */
  exitSession({ commit }, game: GameView) {
    //@ts-ignore
    window.$socket.emit('session-exit', { game })
    commit(types.CLEAR_SESSION)
  },

  playCards({ state: { session } }, cards: CardView[]) {
    //@ts-ignore
    window.$socket.emit('session-choose-card-combination', {
      session: session,
      cards,
      round: session.currentRound,
    })
  },

  nextRound({ commit, state: { session } }) {
    //@ts-ignore
    window.$socket.emit('session-next-round', { session })
    commit(types.UPDATE_GAME_STATE, 'choose-cards')
  },
}
