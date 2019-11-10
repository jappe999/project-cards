import { GetterTree, MutationTree, ActionTree } from 'vuex/types/index'
import * as types from './mutation-types'
import { DeckView } from '~/models/Deck'

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

export const state = () => ({
    decks: [],
})

export type state = ReturnType<typeof state>

export const getters: GetterTree<state, state> = {
    decks: ({ decks }) => decks,
}

export const mutations: MutationTree<state> = {
    [types.FETCH_DECKS](state: state, decks: DeckView[]) {
        let duplicates = {};
        state.decks = [...state.decks, ...decks]
            .filter(obj => duplicates[obj.id] = !duplicates[obj.id])
    },
}

export const actions: ActionTree<state, state> = {
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
