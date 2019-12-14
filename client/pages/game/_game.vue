<template>
  <div class="h-screen w-full overflow-hidden flex flex-col items-center">
    <div
      class="w-full flex justify-between sm:px-4 text-white bg-gray-900 shadow"
    >
      <div class="w-2/3 md:w-auto md:w-80 flex -ml-4 pl-4">
        <nuxt-link class="flex items-center p-4 sm:p-3" to="/game">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="h-5 fill-current"
          >
            <path
              d="M3.828 9l6.071-6.071-1.414-1.414L0 10l.707.707 7.778 7.778 1.414-1.414L3.828 11H20V9H3.828z"
            />
          </svg>
          <span class="hidden md:block pl-2">Back to all games</span>
        </nuxt-link>
      </div>

      <h1
        class="w-full md:w-auto my-auto md:ml-auto md:mr-0 px-2 font-bold text-center"
      >
        {{ game.name }}
      </h1>

      <div class="w-2/3 md:w-auto flex items-center justify-end">
        <app-share
          button-class="py-5 px-4 sm:px-3"
          subject="Let's play a game of cards!"
          text="Join me in this game for horrible people."
          :url="shareURL"
        />

        <button class="py-5 px-4 sm:px-3" @click="toggleSettings(true, 10)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="h-5 fill-current"
          >
            <path
              d="M3.94 6.5L2.22 3.64l1.42-1.42L6.5 3.94c.52-.3 1.1-.54 1.7-.7L9 0h2l.8 3.24c.6.16 1.18.4 1.7.7l2.86-1.72 1.42 1.42-1.72 2.86c.3.52.54 1.1.7 1.7L20 9v2l-3.24.8c-.16.6-.4 1.18-.7 1.7l1.72 2.86-1.42 1.42-2.86-1.72c-.52.3-1.1.54-1.7.7L11 20H9l-.8-3.24c-.6-.16-1.18-.4-1.7-.7l-2.86 1.72-1.42-1.42 1.72-2.86c-.3-.52-.54-1.1-.7-1.7L0 11V9l3.24-.8c.16-.6.4-1.18.7-1.7zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            />
          </svg>
        </button>
      </div>
    </div>

    <main class="h-full w-full relative overflow-x-hidden overflow-y-auto">
      <template v-if="gameLoaded">
        <template v-if="gameExists">
          <keep-alive>
            <nuxt-child />
          </keep-alive>

          <app-game-settings :show="settingsViewOpen" @close="toggleSettings" />
        </template>

        <div v-else class="h-full flex justify-center items-center text-center">
          <app-card-content>
            <h2 class="text-2xl mb-4">This game doesn't exist (anymore).</h2>
            <app-button-link to="/game">
              Back to all games
            </app-button-link>
          </app-card-content>
        </div>
      </template>

      <app-splash-screen v-else />
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, Getter, Mutation } from 'vuex-class'
import * as types from '~/store/mutation-types'
import { GameView } from '~/models/Game'
import { SessionView } from '~/models/Session'

@Component({
  components: {
    AppSplashScreen: () => import('~/components/page/splash-screen.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppButtonLink: () => import('~/components/button/button-link.vue'),
    AppShare: () => import('~/components/share.vue'),
    AppLoader: () => import('~/components/loader.vue'),
    AppGameSettings: () => import('~/components/game/settings.vue'),
  },
})
export default class AppGame extends Vue {
  /** @var gameExists - Does the game exist on the server. */
  get gameExists(): boolean {
    return this.game !== null && Object.keys(this.game).length > 0
  }

  gameLoaded = false

  /** @var settingsViewOpen - Is the settings view open or not. */
  settingsViewOpen: boolean = false

  /** @var game - The game that is currently being played. */
  @Getter('games/currentGame') game!: GameView

  @Mutation(`session/${types.UPDATE_SESSION}`) updateSession: (
    session: Partial<SessionView>,
  ) => void

  @Mutation(`games/${types.SET_CURRENT_GAME_ID}`) setCurrentGameId: (
    id: string,
  ) => void

  @Action('games/fetchGame') fetchGame: (id: string) => GameView
  @Action('session/joinSession') joinSession: (game: GameView) => void
  @Action('session/exitSession') exitSession: (game: GameView) => void

  get shareURL() {
    const { origin, pathname } = window.location
    return origin + pathname
  }

  beforeMount() {
    window.$socket.on('session-join', this.onSessionJoin.bind(this))
    window.$socket.on('session-exit', this.updateSession.bind(this))
  }

  async mounted() {
    const { game: name } = this.$route.params
    const gameId = name
      .split('-')
      .slice(0, 5)
      .join('-')

    const game = await this.fetchGame(gameId)
    this.setCurrentGameId(gameId)

    this.gameLoaded = true

    this.joinSession(game)

    window.onbeforeunload = () => {
      this.exitSession(this.game)
    }
  }

  beforeDestroy() {
    window.onbeforeunload = null
    this.exitSession(this.game)
  }

  onSessionJoin(session) {
    this.updateSession(session)
  }

  /**
   * Open or close the settings panel.
   * @param state - To close or not to close the panel. If left blank it'll be toggled.
   * @param timeout - The time to wait with executing the toggle.
   */
  toggleSettings(state: boolean = null, timeout: number = 0) {
    setTimeout(() => {
      if (state === null) {
        this.settingsViewOpen = !this.settingsViewOpen
      } else {
        this.settingsViewOpen = state
      }
    }, timeout)
  }
}
</script>
