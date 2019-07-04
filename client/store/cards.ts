import * as types from './mutation-types'
import { CardView } from '~/models/Card'

type state = {
  cards: CardView[]
}

interface IQueryOptions {
  skip?: number
  take?: number
  order?: number
  type?: 'Q' | 'A'
}

const getQuery = (options: IQueryOptions = {}): string => {
  const url = new URL('http://localhost')

  Object.entries(options).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return url.search
}

export const state = (): state => ({
  cards: [],
})

export const getters = {
  cards: ({ cards }) => cards,
}

export const mutations = {
  [types.FETCH_CARDS](state: state, cards: CardView[]) {
    state.cards = [...state.cards, ...cards]
  },
}

export const actions: { [key: string]: any } = {
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
