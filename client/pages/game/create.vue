<template>
  <div class="max-w-lg flex flex-col items-center p-4">
    <app-card class="w-full">
      <app-card-content>
        <h2 class="text-2xl font-bold">
          Create a new game
        </h2>
      </app-card-content>

      <hr class="w-full mb-4 border-b border-gray" />

      <form @submit.prevent="createGame">
        <app-card-content>
          <app-input
            v-model="game.name"
            name="name"
            label="Room name"
            required
          />

          <!-- The following option is not available yet -->
          <label v-if="false" class="flex items-center text-black">
            <input v-model="game.private" type="checkbox" class="mr-2" />
            <small>Private game?</small>
          </label>
        </app-card-content>

        <app-card-content>
          <app-settings-decks @select-decks="selectDecks" />
        </app-card-content>

        <hr class="w-full border-b border-gray" />

        <app-card-content>
          <div class="flex justify-end">
            <app-button type="submit">Create game</app-button>
          </div>
        </app-card-content>
      </form>
    </app-card>

    <app-link class="mt-4" to="/game">Or join game</app-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, Mutation } from 'vuex-class'
import { Form } from '~/plugins'
import { GameCreate, GameView } from '~/models/Game'
import * as types from '~/store/mutation-types'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppSettingsDecks: () => import('~/components/game/settings/decks.vue'),
    AppInput: () => import('~/components/form/input.vue'),
    AppButton: () => import('~/components/button/button.vue'),
    AppLink: () => import('~/components/link.vue'),
  },
})
export default class CreateGame extends Vue {
  playerInputVisible = true
  game: Form<GameCreate> = new Form<GameCreate>({
    name: '',
    private: false,
    decks: [],
  })

  @Mutation(`games/${types.FETCH_GAME}`) fetchGame

  @Action('games/joinGame') joinGame

  selectDecks(decks) {
    this.game.fill({
      ...this.game.data(),
      decks,
    })
  }

  async createGame() {
    try {
      const { data: game } = await this.game.post<GameView>(`games`)
      this.fetchGame(game)

      const lowerCaseName = game.name.replace(/\s/g, '-').toLowerCase()
      this.$router.push(`/game/${game.id}-${lowerCaseName}/play`)
    } catch (e) {
      // TODO: Notify user
    }
  }
}
</script>
