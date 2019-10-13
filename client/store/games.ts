import { GameView } from '~/models/Game'
import * as types from './mutation-types'

type state = {
  games: GameView[]
  currentGame: GameView
}

export const state = (): state => ({
  games: [],
  currentGame: null,
})

export const getters = {
  games: ({ games }: state) => games,
  currentGame: ({ currentGame }) => currentGame,
}

export const mutations = {
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
    state.games = state.games.map(item => (item.id === game.id ? game : item))
  },

  [types.REMOVE_GAME](state: state, game: GameView) {
    state.games = state.games.filter(item => item.id !== game.id)
  },
}

export const actions: { [key: string]: any } = {
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
}
