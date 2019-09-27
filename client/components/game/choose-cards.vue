<template>
  <app-game-view>
    <template slot="side">
      <app-playcard
        color="black"
        class="sm:h-96 w-full sm:w-64 mb-4"
        :disabled="true"
      >
        {{ blackCard.text }}

        <template slot="footer">
          <small class="flex items-center">
            Choose
            <div
              class="h-5 w-5 flex justify-center items-center ml-2 bg-white text-black rounded-full"
            >
              {{ blackCard.numAnswers }}
            </div>
          </small>
        </template>
      </app-playcard>
      <app-button
        class="w-full"
        :disabled="canSelectCard"
        @click.native="playCards"
      >
        Play Card
      </app-button>
    </template>

    <template slot="main">
      <div
        v-for="card in cards"
        :key="card.id"
        class="w-full md:w-1/2 lg:w-auto -mt-2 p-2"
      >
        <app-playcard
          class="h-full lg:h-96 w-full lg:w-64"
          :step="cardNumber(card)"
          :disabled="!(canSelectCard || cardNumber(card) > 0)"
          :text="card.text"
          @toggle="toggleCard(card)"
        />
      </div>
    </template>
  </app-game-view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { CardView } from '~/models/Card'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
    AppGameView: () => import('~/components/game/game-view.vue'),
  },

  watch: {
    blackCard(_, { numAnswers }: CardView) {
      if (numAnswers) {
        this.fetchNewCards(numAnswers)
      }
    },
  },
})
export default class AppChooseCards extends Vue {
  /** @var cards - The cards in the hand of the player. */
  cards: CardView[] = []

  @Prop({ default: 0, type: Number }) round!: number
  @Prop({ default: {}, type: Object }) blackCard!: CardView
  @Prop({ default: [], type: Array }) selectedCards!: CardView[]
  @Prop({ default: {}, type: Object }) session!: any

  @Action('cards/fetchCards') fetchCards

  /** @var $socket - The socket connection to the server. */
  get $socket(): SocketIOClient.Socket {
    const name = '$socket'
    return window[name]
  }

  async mounted() {
    this.cards = await this.fetchCards({ type: 'A' })
  }

  /**
   * The number that will appaer on the card that is selected next.
   */
  cardNumber(card: CardView): number {
    return this.selectedCards.findIndex(c => c.id === card.id) + 1
  }

  /**
   * If the user can select a card.
   */
  get canSelectCard() {
    return this.selectedCards.length < this.blackCard.numAnswers
  }

  /**
   * Replace the previously chosen cards with new ones.
   * @param amount - The amount of cards to fetch.
   */
  @Emit('select')
  async fetchNewCards(amount: number = 1) {
    const newCards = await this.fetchCards({
      type: 'A',
      take: amount,
    })

    // Filter out the cards that have been selected.
    const cardsWithoutOld = this.cards.filter(
      card => !this.selectedCards.includes(card),
    )
    this.cards = cardsWithoutOld.concat(newCards)

    // Reset the selected cards with an empty array.
    return []
  }

  /**
   * Add a card if it's not already selected. Else remove it from the array.
   *
   * @param card - The card to toggle in the list of selected cards.
   */
  @Emit('select')
  toggleCard(card: CardView) {
    if (this.canSelectCard && !this.selectedCards.includes(card)) {
      return [...this.selectedCards, card]
    } else {
      return this.selectedCards.filter(c => c.id !== card.id)
    }
  }

  @Emit('submit')
  playCards() {
    this.$socket.emit('session-play-card', {
      session: this.session,
      cards: this.selectedCards,
      round: this.round,
    })
  }
}
</script>
