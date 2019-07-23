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
        class="w-full md:w-1/2 lg:w-auto p-2"
      >
        <app-playcard
          class="h-full lg:h-96 w-full lg:w-64"
          :step="cardNumber(card)"
          :disabled="!(canSelectCard || cardNumber(card) > 0)"
          @toggle="toggleCard(card)"
        >
          {{ card.text }}
        </app-playcard>
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
})
export default class AppChooseCards extends Vue {
  /** @var $socket - The socket connection to the server. */
  $socket!: SocketIOClient.Socket

  /** @var cards - The cards in the hand of the player. */
  cards: CardView[] = []

  @Prop({ default: 0, type: Number }) round!: number
  @Prop({ default: {}, type: Object }) blackCard!: CardView
  @Prop({ default: [], type: Array }) selectedCards!: CardView[]
  @Prop({ default: {}, type: Object }) session!: any

  @Action('cards/fetchCards') fetchCards

  async mounted() {
    this.cards = await this.fetchCards({ type: 'A' })
  }

  cardNumber(card: CardView): number {
    return this.selectedCards.findIndex(c => c.id === card.id) + 1
  }

  get canSelectCard() {
    return this.selectedCards.length < this.blackCard.numAnswers
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
