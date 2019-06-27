<template>
  <div class="h-screen w-full overflow-hidden flex flex-col items-center">
    <header
      class="w-full flex justify-between py-4 px-6 text-white bg-gray-900 shadow"
    >
      <h1>
        Game: <b>{{ game.name }}</b>
      </h1>
    </header>

    <main class="h-full w-full flex overflow-auto">
      <div class="w-1/4 flex flex-col items-center">
        <app-play-card color="black">Hello</app-play-card>
        <app-button class="w-full" @click.native="playCard">
          Play Card
        </app-button>
      </div>
      <div class="w-1/2">
        <div class="flex justify-start flex-wrap items-stretch">
          <app-play-card v-for="card in cards" :key="card" class="m-2">
            {{ card }}
          </app-play-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/vue-app'
import { Game } from '~/models/Game'
import socket from '~/plugins/socket.io'
import { Action } from 'vuex-class'

@Component({
  async asyncData(context: Context) {
    const { game: name } = context.route.params
    const gameId = name
      .split('-')
      .slice(0, 5)
      .join('-')
    const game = await context.store.dispatch('games/fetchGame', gameId)
    const cards = await context.store.dispatch('card/fetchCards')

    return { game, cards }
  },

  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppPlayCard: () => import('~/components/play-card.vue'),
  },
})
export default class PlayGame extends Vue {
  game!: Game
  session!: any
  cardsPlayed: string[] = []

  @Action('sessions/join') joinSession

  beforeMount() {
    const c = console
    c.log(this.game)
    this.joinSession(this.game)

    socket.on('session-join', event => {
      c.log(event)
      this.session = event
    })

    socket.on('session-play-card', event => {
      c.log(event)

      this.cardsPlayed.push(event)
    })
  }

  playCard() {
    socket.emit('session-play-card', {
      session: this.session,
      card: Math.random().toString(36),
    })
  }
}
</script>
