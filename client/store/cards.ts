import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import * as types from './mutation-types'
import { CardView } from '~/models/Card'

interface IQueryOptions {
  skip?: number
  take?: number
  order?: number
  type?: 'Q' | 'A'
  gameId?: string
}

const getQuery = (options: IQueryOptions = {}): string => {
  const params = new URLSearchParams()

  Object.entries(options).forEach(([key, value]) => {
    params.set(key, value)
  })

  return '?' + params.toString()
}

export const state = () => ({
  cards: [] as CardView[],
})

export type state = ReturnType<typeof state>

export const getters: GetterTree<state, state> = {
  cards: ({ cards }) => cards,
}

export const mutations: MutationTree<state> = {
  [types.FETCH_CARDS](state: state, cards: CardView[]) {
    state.cards = [...state.cards, ...cards]
  },
}

export const actions: ActionTree<state, state> = {
  async fetchCards(
    { commit },
    options: IQueryOptions = {},
  ): Promise<CardView[]> {
    const query = getQuery(options)
    const { data: cards }: { data: CardView[] } = await this.$axios.get(
      `cards${query}`,
    )
    commit(types.FETCH_CARDS, cards)
    return cards
  },

  async fetchCard(
    { commit },
    options: IQueryOptions = {},
  ): Promise<CardView[]> {
    const query = getQuery({ ...options, skip: 0, take: 1 })
    const { data: cards }: { data: CardView[] } = await this.$axios.get(
      `cards${query}`,
    )
    commit(types.FETCH_CARDS, cards)
    return cards
  },
}
