<template>
  <div class="h-screen w-full overflow-hidden flex flex-col items-center">
    <div class="w-full flex sm:px-4 text-white bg-gray-900 shadow">
      <div class="md:w-80 flex -ml-4 pl-4">
        <nuxt-link
          class="flex items-center p-4"
          to="/game"
          @click.native="exitSession(game)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="h-5 fill-current"
          >
            <path
              d="M3.828 9l6.071-6.071-1.414-1.414L0 10l.707.707 7.778 7.778 1.414-1.414L3.828 11H20V9H3.828z"
            />
          </svg>
          <span class="hidden sm:block pl-2">Back to all games</span>
        </nuxt-link>
      </div>

      <div class="w-full sm:w-auto md:ml-auto flex items-center justify-end">
        <h1 class="mx-auto md:mr-0 px-2 font-bold">
          {{ game.name }}
        </h1>

        <app-share
          button-class="p-5"
          subject="Let's play a game of cards!"
          text="Join me in this game for horrible people."
          :url="shareURL"
        />
      </div>
    </div>

    <main class="h-full w-full relative overflow-x-hidden overflow-y-auto">
      <nuxt-child />
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { GameView } from '../../models/Game'

@Component({
  components: {
    AppShare: () => import('~/components/share.vue'),
  },
})
export default class AppGame extends Vue {
  /** @var game - The game that is currently being played. */
  @Getter('session/game') game!: GameView

  @Action('games/fetchGame') fetchGame: (id: string) => GameView
  @Action('session/joinSession') joinSession: (game: GameView) => void
  @Action('session/exitSession') exitSession: (game: GameView) => void

  get shareURL() {
    const { origin, pathname } = window.location
    return origin + pathname
  }

  async mounted() {
    const { game: name } = this.$route.params
    const gameId = name
      .split('-')
      .slice(0, 5)
      .join('-')
    const game = await this.fetchGame(gameId)
    this.joinSession(game)

    window.onbeforeunload = () => {
      this.exitSession(this.game)
    }
  }

  beforeDestroy() {
    window.onbeforeunload = null
    this.exitSession(this.game)
  }
}
</script>
