import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import { GameView } from '~/models/Game'
import * as types from './mutation-types'

export const state = () => ({
  games: [],
  currentGameId: null,
})

export type state = ReturnType<typeof state>

export const getters: GetterTree<state, state> = {
  games: ({ games }: state) => games,
  currentGame: ({ games, currentGameId }: state) =>
    games.find(({ id }) => id === currentGameId),
  gameDecks: ({ games, currentGameId }: state) => {
    const game = games.find(({ id }) => id === currentGameId)
    return game && game.decks ? game.decks : []
  }
}

export const mutations: MutationTree<state> = {
  [types.SET_CURRENT_GAME_ID](state: state, id: string) {
    state.currentGameId = id
  },

  [types.FETCH_GAMES](state: state, games: GameView[]) {
    state.games = [
      ...state.games,
      ...games.filter(
        game => state.games.findIndex(x => x.id === game.id) === -1,
      ),
    ]
  },

  [types.FETCH_GAME](state: state, game: GameView) {
    state.games = [
      ...state.games,
      ...[game].filter(
        game => state.games.findIndex(x => x.id === game.id) === -1,
      ),
    ]
  },

  [types.UPDATE_GAME](state: state, game: GameView) {
    state.games = state.games.map(item => (
      item.id === game.id
        ? { ...item, ...game }
        : item
    ))
  },

  [types.REMOVE_GAME](state: state, game: GameView) {
    state.games = state.games.filter(item => item.id !== game.id)
  },
}

export const actions: ActionTree<state, state> = {
  async fetchGames({ commit }): Promise<GameView[]> {
    const { data }: { data: GameView[] } = await this.$axios.get(`games`)
    commit(types.FETCH_GAMES, data)
    return data
  },

  async fetchGame({ commit }, id: string): Promise<GameView> {
    try {
      const { data }: { data: GameView } = await this.$axios.get(`games/${id}`)
      commit(types.FETCH_GAME, data)
      return data
    } catch (error) {
      return <GameView>{}
    }
  },

  async updateGame({ commit, getters }, game: GameView): Promise<GameView> {
    try {
      const { data }: { data: GameView } = await this.$axios.put('games', {
        ...getters.currentGame,
        ...game
      })
      commit(types.UPDATE_GAME, data)
      return data
    } catch (error) {
      return <GameView>{}
    }
  },
}
