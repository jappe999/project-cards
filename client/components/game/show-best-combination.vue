<template>
  <app-game-view :session="session">
    <template slot="side">
      <app-playcard
        color="black"
        class="sm:h-96 w-full sm:w-64 mb-4"
        :disabled="true"
        :text="blackCard.text"
      />
      <app-button class="w-full" @click.native="nextRound">
        Next round
      </app-button>
    </template>

    <template slot="main">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="w-full lg:w-auto -mt-2 p-2"
      >
        <app-playcard
          class="lg:h-96 w-full lg:w-64"
          :step="index + 1"
          :disabled="true"
          :text="card.text"
        />
      </div>
    </template>
  </app-game-view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { CardView } from '~/models/Card'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
    AppGameView: () => import('~/components/game/game-view.vue'),
  },
})
export default class AppShowBestCombination extends Vue {
  @Getter('session/blackCard') blackCard!: CardView
  @Getter('session/session') session!: SessionView

  @Prop({ default: () => [], type: Array }) cards!: CardView[]

  @Action('session/nextRound') nextRound: () => void
}
</script>
