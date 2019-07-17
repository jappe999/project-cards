<template>
  <div class="h-full w-full flex flex-col sm:flex-row overflow-auto">
    <div
      class="min-w-64 sticky top-0 flex flex-col items-center p-4 sm:p-8 sm:border-r border-gray-400 bg-gray-200 shadow sm:shadow-none"
    >
      <app-playcard
        color="black"
        class="sm:h-96 w-full sm:w-64 mb-4"
        :disabled="true"
      >
        {{ blackCard.text }}
      </app-playcard>
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
        v-for="card in playcards"
        :key="card.id"
        class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 pb-4 px-2"
      >
        <app-playcard
          class="h-full"
          :step="cardNumber(card)"
          :disabled="!(canSelectCard || cardNumber(card) > 0)"
          @toggle="toggleCard(card)"
        >
          {{ card.text }}
        </app-playcard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { CardView } from '~/models/Card'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
  },
})
export default class AppChooseCards extends Vue {
  /** @var $socket - The socket connection to the server. */
  $socket!: SocketIOClient.Socket

  /** @var playcards - The cards in the hand of the player. */
  playcards: CardView[] = []

  @Prop({ default: {}, type: Object }) blackCard!: CardView
  @Prop({ default: [], type: Array }) selectedCards!: CardView[]
  @Prop({ default: {}, type: Object }) session!: any

  @Action('cards/fetchCards') fetchCards

  async mounted() {
    this.playcards = await this.fetchCards({ type: 'A' })
  }

  cardNumber(card: CardView): number {
    return this.selectedCards.findIndex(c => c.id === card.id) + 1
  }

  get canSelectCard() {
    return this.selectedCards.length < this.blackCard.numAnswers
  }

  @Emit('select')
  /**
   * Add a card if it's not already selected. Else remove it from the array.
   *
   * @param card - The card to toggle in the list of selected cards.
   */
  toggleCard(card: CardView) {
    if (this.canSelectCard && !this.selectedCards.includes(card)) {
      return [...this.selectedCards, card]
    } else {
      return this.selectedCards.filter(c => c.id !== card.id)
    }
  }

  playCard() {
    this.$socket.emit('session-play-card', {
      session: this.session,
      cards: this.selectedCards,
    })
  }
}
</script>
