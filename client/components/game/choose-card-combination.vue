<template>
  <app-game-view>
    <template slot="side">
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
        @click.native="playCards"
      >
        Play Card
      </app-button>
    </template>

    <template slot="main">
      <div
        v-for="_cards in cards"
        :key="_cards.id"
        class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 relative flex flex-wrap flex-grow mb-2 group"
        @click="toggleChoice(_cards)"
      >
        <div
          v-for="(card, index) in _cards"
          :key="card.id"
          class="flex-grow w-full p-2"
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
          v-if="_cards.length > 1 && canSelectCard"
          class="w-full absolute inset-0 group-hover:bg-gray-800 opacity-25 cursor-pointer"
        />
      </div>
    </template>
  </app-game-view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { CardView } from '~/models/Card'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
    AppGameView: () => import('~/components/game/game-view.vue'),
  },
})
export default class AppChooseCardCombination extends Vue {
  /** @var $socket - The socket connection to the server. */
  $socket!: SocketIOClient.Socket

  @Prop({ default: 0, type: Number }) round!: number
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
    this.$socket.emit('session-choose-card-combination', {
      session: this.session,
      cards: this.selectedCards,
      round: this.round,
    })
  }
}
</script>
