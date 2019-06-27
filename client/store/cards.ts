import * as types from './mutation-types'
import { CardView } from '~/models/Card'

type state = {
  cards: CardView[]
}

export const state: state = {
  cards: [],
}

export const getters = {
  cards: ({ cards }) => cards,
}

export const mutations = {
  [types.FETCH_CARDS](state: state, cards: CardView[]) {
    state.cards = [...state.cards, ...cards]
  },
}

export const actions: { [key: string]: any } = {
  async fetchCards({ commit }): Promise<CardView[]> {
    const { data: cards }: { data: CardView[] } = await this.$axios.get(`cards`)
    commit(types.FETCH_CARDS, cards)
    return cards
  },
}
