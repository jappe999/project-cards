<template>
  <app-game-view :session="session">
    <template slot="side">
      <app-playcard
        color="black"
        class="sm:h-96 w-full sm:w-64 mb-4"
        :disabled="true"
        :text="blackCard.text"
      />
      <app-button
        v-if="showCards && isCzar"
        class="w-full"
        :disabled="canSelectCard"
        @click.native="playCards"
      >
        Choose combination
      </app-button>
    </template>

    <template slot="main">
      <div
        v-for="_cards in cards"
        :key="_cards.id"
        class="w-full lg:w-auto relative flex flex-wrap -mt-2 group"
        @click="toggleChoice(_cards)"
      >
        <div
          v-for="(card, index) in _cards"
          :key="card.id"
          class="w-full lg:w-auto p-2"
          :class="{
            'md:w-1/2': _cards.length > 1,
          }"
        >
          <app-playcard
            class="h-full lg:h-96 w-full lg:w-64"
            :disabled="!canSelectCard || !isCzar"
            :step="index + 1"
            :text="showCards ? card.text : ''"
          />
        </div>

        <div
          v-if="
            (_cards.length > 1 && canSelectCard && isCzar) ||
              selectedCards == _cards
          "
          class="h-full w-full absolute inset-0 group-hover:bg-gray-800 opacity-25 cursor-pointer rounded"
          :class="{ 'bg-gray-800': selectedCards == _cards }"
        />
      </div>
    </template>
  </app-game-view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CardView } from '~/models/Card'
import { SessionView } from '~/models/Session'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
    AppGameView: () => import('~/components/game/game-view.vue'),
  },
})
export default class AppChooseCardCombination extends Vue {
  @Getter('session/blackCard') blackCard!: CardView
  @Getter('session/round') round!: number
  @Getter('session/session') session!: SessionView

  @Prop({ default: false, type: Boolean }) isCzar!: boolean
  @Prop({ default: () => [], type: Array }) cards!: CardView[]
  @Prop({ default: false, type: Boolean }) showCards!: boolean
  @Prop({ default: () => [], type: Array }) selectedCards!: CardView[]

  get canSelectCard() {
    return this.selectedCards.length < 1
  }

  @Action('session/playCards') chooseCardCombination: (
    cards: CardView[],
  ) => void

  /**
   * Add a card if it's not already selected. Else remove it from the array.
   * @param cards - The array of cards to toggle in the list of selected cards.
   */
  @Emit('select')
  toggleChoice(cards: CardView[]) {
    if (this.showCards && this.isCzar) {
      return cards
    } else {
      return []
    }
  }

  @Emit('submit')
  playCards() {
    this.chooseCardCombination(this.selectedCards)
  }
}
</script>
