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
        >
          {{ card.text }}
        </app-playcard>
      </div>
    </template>
  </app-game-view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { CardView } from '~/models/Card'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
    AppGameView: () => import('~/components/game/game-view.vue'),
  },
})
export default class AppShowBestCombination extends Vue {
  @Prop({ default: () => ({}), type: Object }) blackCard!: CardView
  @Prop({ default: () => [], type: Array }) cards!: CardView[]
  @Prop({ default: () => ({}), type: Object }) session!: any

  /** @var $socket - The socket connection to the server. */
  get $socket(): SocketIOClient.Socket {
    const name = '$socket'
    return window[name]
  }

  nextRound() {
    this.$socket.emit('session-next-round', {
      session: this.session,
    })
  }
}
</script>
