<template>
  <div class="w-96 flex flex-col items-center">
    <app-card class="w-full">
      <app-card-content>
        <h2 class="text-2xl font-bold">
          Create a new game
        </h2>
        <hr class="w-full mt-2 mb-4 border-b border-gray" />

        <form @submit.prevent="createGame">
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

          <div class="flex justify-end">
            <app-button type="submit">Create game</app-button>
          </div>
        </form>
      </app-card-content>
    </app-card>

    <app-link class="mt-4" to="/game">Or join game</app-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { mapMutations } from 'vuex'
import { Action, Mutation } from 'vuex-class'
import { Form } from '~/plugins'
import { GameCreate, GameView } from '~/models/Game'
import * as types from '~/store/mutation-types'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
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
  })

  constructor() {
    super()

    Object.assign(
      this,
      mapMutations({
        [types.FETCH_GAME]: `games/${types.FETCH_GAME}`,
      }),
    )
  }

  @Action('games/joinGame') joinGame
  @Mutation(types.FETCH_GAME) FETCH_GAME

  async createGame() {
    try {
      const { data: game } = await this.game.post<GameView>(`games`)
      this.FETCH_GAME(game)

      const lowerCaseName = game.name.replace(' ', '-').toLowerCase()
      this.$router.push(`/game/${game.id}-${lowerCaseName}/play`)
    } catch (e) {
      // TODO: Notify user
    }
  }
}
</script>
