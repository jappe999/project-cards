import * as types from './mutation-types'
import { DeckView } from '~/models/Deck'

type state = {
    decks: DeckView[]
}

interface IQueryOptions {
    skip?: number
    take?: number
    order?: number
    type?: 'Q' | 'A'
}

const getQuery = (options: IQueryOptions = {}): string => {
    const params = new URLSearchParams()

    Object.entries(options).forEach(([key, value]) => {
        params.set(key, value)
    })

    return params.toString() !== '' ? '?' + params.toString() : ''
}

export const state = (): state => ({
    decks: [],
})

export const getters = {
    decks: ({ decks }) => decks,
}

export const mutations = {
    [types.FETCH_DECKS](state: state, decks: DeckView[]) {
        state.decks = [...state.decks, ...decks]
    },
}

export const actions: { [key: string]: any } = {
    async fetchDecks(
        { commit },
        options: IQueryOptions = {},
    ): Promise<DeckView[]> {
        const query = getQuery(options)
        const { data: decks }: { data: DeckView[] } = await this.$axios.get(
            `decks${query}`,
        )
        commit(types.FETCH_DECKS, decks)
        return decks
    },

    async fetchDeck(
        { commit },
        options: IQueryOptions = {},
    ): Promise<DeckView[]> {
        const query = getQuery({ ...options, skip: 0, take: 1 })
        const { data: decks }: { data: DeckView[] } = await this.$axios.get(
            `decks${query}`,
        )
        commit(types.FETCH_DECKS, decks)
        return decks
    },
}
