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
    </div>

    <div class="w-full flex flex-wrap -mt-2 mb-auto py-8 px-2 sm:px-6">
      <div
        v-for="_cards in cards"
        :key="_cards.id"
        class="h-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 relative mb-2 group"
        @click="toggleChoice(_cards)"
      >
        <div
          v-for="(card, index) in _cards"
          :key="card.id"
          class="w-full p-2"
          @click="playCards"
        >
          <app-playcard
            class="h-full cursor-pointer"
            :disabled="!canSelectCard"
            :step="index + 1"
          >
            {{ card.text }}
          </app-playcard>
        </div>

        <div
          v-if="cards.length > 1"
          class="w-full absolute inset-0 group-hover:bg-gray-800 opacity-25 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { CardView } from '~/models/Card'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
  },
})
export default class AppChooseCardCombination extends Vue {
  /** @var $socket - The socket connection to the server. */
  $socket!: SocketIOClient.Socket

  @Prop({ default: () => ({}), type: Object }) blackCard!: CardView
  @Prop({ default: () => [], type: Array }) cards!: CardView[]
  @Prop({ default: () => [], type: Array }) selectedCards!: CardView[]
  @Prop({ default: () => ({}), type: Object }) session!: any

  get canSelectCard() {
    return this.selectedCards.length < 1
  }

  /**
   * Add a card if it's not already selected. Else remove it from the array.
   *
   * @param cards - The array of cards to toggle in the list of selected cards.
   */
  @Emit('select')
  toggleChoice(cards: CardView[]) {
    return cards
  }

  @Emit('submit')
  playCards() {
    const c = console
    c.log(this.selectedCards)

    this.$socket.emit('session-choose-card-combination', {
      session: this.session,
      cards: this.selectedCards,
    })
  }
}
</script>
