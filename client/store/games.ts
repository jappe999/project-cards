import { GameView } from '~/models/Game'
import * as types from './mutation-types'

type state = {
  games: GameView[]
}

export const state = (): state => ({
  games: [],
})

export const getters = {
  games: ({ games }: state) => games,
}

export const mutations = {
  [types.ADD_GAME](state: state, game: GameView) {
    state.games = [...state.games, game]
  },

  [types.UPDATE_GAME](state: state, game: GameView) {
    state.games = state.games.map(item => (item.id === game.id ? game : item))
  },

  [types.REMOVE_GAME](state: state, game: GameView) {
    state.games = state.games.filter(item => item.id !== game.id)
  },
}

export const actions: { [key: string]: any } = {
  async fetchGames(): Promise<GameView[]> {
    const { data }: { data: GameView[] } = await this.$axios.get(`games`)
    return data
  },

  async fetchGame(state: state, id: string): Promise<GameView> {
    try {
      const { data }: { data: GameView } = await this.$axios.get(`games/${id}`)
      return data
    } catch (error) {
      return <GameView>{}
    }
  },

  joinGame(state: state, game: GameView): Promise<GameView> {
    return Promise.resolve(game)
  },
}
