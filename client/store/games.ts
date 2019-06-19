import axios from 'axios'
import { GameView } from '~/models/Game'
import * as types from './mutation-types'

type state = {
  games: GameView[]
}

export const state: state = {
  games: []
}

export const getters = {
  games: ({ games }: state) => games
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
  }
}

export const actions = {
  async fetchGames(): Promise<GameView[]> {
    const { data }: { data: GameView[] } = await axios.get(`games`)
    return data
  },

  async fetchGame(name: string): Promise<GameView> {
    const { data }: { data: GameView } = await axios.get(`games/${name}`)
    return data
  },

  async joinGame(game: GameView): Promise<boolean> {
    return true
  }
}
