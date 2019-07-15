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

    <main class="h-full w-full flex flex-col sm:flex-row overflow-auto">
      <div
        class="min-w-64 sticky top-0 flex flex-col items-center p-4 sm:p-8 sm:border-r border-gray-400 bg-gray-200 shadow sm:shadow-none"
      >
        <app-play-card
          color="black"
          class="sm:h-96 w-full sm:w-64 mb-4"
          :disabled="true"
        >
          {{ blackCard.text }}
        </app-play-card>
        <app-button
          class="w-full"
          :disabled="canSelectCard"
          @click.native="playCard"
        >
          Play Card
        </app-button>
      </div>
      <div class="flex flex-wrap flex-grow py-8 px-2 sm:px-6">
        <div
          v-for="card in cards"
          :key="card.id"
          class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 pb-4 px-2"
        >
          <app-play-card
            class="h-full"
            :step="cardIndex(card)"
            :disabled="!(canSelectCard || cardIndex(card) > 0)"
            @toggle="toggleCard(card)"
          >
            {{ card.text }}
          </app-play-card>
        </div>
      </div>
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
    const cards = await context.store.dispatch('cards/fetchCards', {
      type: 'A',
    })

    return { game, cards }
  },

  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlayCard: () => import('~/components/play-card.vue'),
  },
})
export default class PlayGame extends Vue {
  $socket!: SocketIOClient.Socket
  game!: Game
  session!: any
  blackCards: CardView[] = []
  cards: CardView[] = []
  cardsPlayed: string[] = []
  selectedCards: CardView[] = []

  @Action('sessions/join') joinSession
  @Action('sessions/exit') exitSession

  get blackCard(): CardView {
    return this.blackCards[this.blackCards.length - 1] || <CardView>{}
  }

  get canSelectCard() {
    return this.selectedCards.length < this.blackCard.numAnswers
  }

  beforeMount() {
    this.$socket.on('session-join', ({ currentCard: blackCard, ...event }) => {
      this.session = event
      this.blackCards = [...this.blackCards, blackCard]
    })

    this.$socket.on('next-card', (blackCard: CardView) => {
      window.navigator.vibrate(100)
      this.blackCards = [...this.blackCards, blackCard]
    })

    this.$socket.on('session-play-card', event => {
      this.cardsPlayed.push(event)
    })

    this.joinSession(this.game)
  }

  cardIndex(card: CardView): number {
    return this.selectedCards.findIndex(c => c.id === card.id) + 1
  }

  /**
   * Add a card if it's not already selected. Else remove it from the array.
   *
   * @param card - The card to toggle in the list of selected cards.
   */
  toggleCard(card: CardView) {
    if (this.canSelectCard && !this.selectedCards.includes(card)) {
      this.selectedCards.push(card)
    } else {
      this.selectedCards = this.selectedCards.filter(c => c.id !== card.id)
    }
  }

  playCard() {
    this.$socket.emit('session-play-card', {
      session: this.session,
      card: Math.random().toString(36),
    })
  }
}
</script>
