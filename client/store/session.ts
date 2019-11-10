import { ActionTree, GetterTree, MutationTree } from 'vuex/types/index'
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

export const state = () => ({
  session: null as SessionView,
  gameState: '' as gameState,
  players: [] as PlayerView[],
})

export type state = ReturnType<typeof state>

export const getters: GetterTree<state, state> = {
  session: ({ session }): SessionView => session || <SessionView>{},
  game: ({ session }): GameView => (session && session.game) || <GameView>{},
  blackCard: ({ session }): CardView => (session && session.currentCard) || <CardView>{},
  round: ({ session }): number => (session && session.currentRound) || 0,
  gameState: ({ gameState }): gameState => gameState,
  players: ({ players }): PlayerView[] => players,
}

export const mutations: MutationTree<state> = {
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

export const actions: ActionTree<state, state> = {
  /**
   * Emit a message to join a game session.
   */
  joinSession({ commit }, game: GameView) {
    window.$socket.emit('session-join', { game })
    commit(types.UPDATE_SESSION, game)
  },

  /**
   * Emit a message to exit a game session.
   */
  exitSession({ commit }, game: GameView) {
    window.$socket.emit('session-exit', { game })
    commit(types.CLEAR_SESSION)
  },

  playCards({ state: { session } }, cards: CardView[]) {
    window.$socket.emit('session-choose-card-combination', {
      session: session,
      cards,
      round: session.currentRound,
    })
  },

  nextRound({ commit, state: { session } }) {
    window.$socket.emit('session-next-round', { session })
    commit(types.UPDATE_GAME_STATE, 'choose-cards')
  },
}
