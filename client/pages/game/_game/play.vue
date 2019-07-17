<template>
  <div class="h-screen w-full overflow-hidden flex flex-col items-center">
    <div
      class="w-full flex justify-between py-4 px-4 sm:px-8 text-white bg-gray-900 shadow"
    >
      <nav>
        <nuxt-link
          class="flex -ml-2 px-2"
          to="/game"
          @click.native="exitSession(game)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="fill-current"
          >
            <path
              d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z"
            />
          </svg>
          <span class="pl-2">Back to all games</span>
        </nuxt-link>
      </nav>
      <h1>
        Game:
        <b v-select-on-focus contenteditable>{{ game.name }}</b>
      </h1>
    </div>

    <main class="h-full w-full">
      <app-choose-cards
        v-if="state === 'choose-cards'"
        :selected-cards="selectedCards"
        :black-card="blackCard"
        :session="session"
        @select="selectCards"
      />

      <app-choose-card-combination
        v-if="state === 'choose-card-combination'"
        :cards="selectedCards"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/vue-app'
import { Vue, Component } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { Game } from '~/models/Game'
import { CardView } from '~/models/Card'

@Component({
  async asyncData(context: Context) {
    const { game: name } = context.route.params
    const gameId = name
      .split('-')
      .slice(0, 5)
      .join('-')
    const game = await context.store.dispatch('games/fetchGame', gameId)

    return { game }
  },

  components: {
    AppPlaycard: () => import('~/components/game/playcard.vue'),
    AppChooseCards: () => import('~/components/game/choose-cards.vue'),
  },
})
export default class PlayGame extends Vue {
  /** @var $socket - The socket connection to the server. */
  $socket!: SocketIOClient.Socket

  /** @var game - The game that is currently being played. */
  game!: Game

  /** @var round - The number of the current round. */
  round: number = 1

  /** @var session - The session the user is currently in. */
  session: any = {}

  state: string = 'choose-cards'

  /** @var blackCards - The black cards that have been or are being used for a round. */
  blackCards: CardView[] = []

  /** @var cardsPlayed - Cards played in a round. */
  cardsPlayed: CardView[][] = []

  /** @var selectedCards - The cards that the player has selected this round. */
  selectedCards: CardView[] = []

  /** Vuex action to join a game session. */
  @Action('sessions/join') joinSession

  /** Vuex action to exit a game session. */
  @Action('sessions/exit') exitSession

  /** The black card for the current round. */
  get blackCard(): CardView {
    return this.blackCards[this.round - 1] || <CardView>{}
  }

  beforeMount() {
    this.$socket.on('session-join', this.onSessionJoin.bind(this))
    this.$socket.on('session-next-round', this.onSessionNextRound.bind(this))
    this.$socket.on('session-play-card', this.onSessionPlayCard.bind(this))

    this.joinSession(this.game)
  }

  onSessionJoin({ currentCard: blackCard, ...event }) {
    this.session = event
    this.blackCards = [...this.blackCards, blackCard]
  }

  onSessionNextRound(blackCard: CardView) {
    window.navigator.vibrate(100)
    this.blackCards = [...this.blackCards, blackCard]
  }

  onSessionPlayCard(cards) {
    const alreadyPlayed = this.cardsPlayed[this.round] || []
    this.cardsPlayed[this.round] = [alreadyPlayed, cards]
  }

  selectCards(cards: CardView[]) {
    this.selectedCards = cards
  }
}
</script>
