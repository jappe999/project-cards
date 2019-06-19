<template>
  <div class="w-full flex flex-col items-center">
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
          <label class="flex items-center text-black">
            <input v-model="game.private" type="checkbox" class="mr-2" />
            <small>Private game?</small>
          </label>

          <div class="flex justify-end">
            <app-button @click.native="createGame">Create game</app-button>
          </div>
        </form>
      </app-card-content>
    </app-card>

    <app-link class="mt-4" to="/game/join">Or join game</app-link>
  </div>
</template>

<script lang="ts">
import { mapMutations } from 'vuex'
import { Vue, Component } from 'vue-property-decorator'
import { Form } from '~/plugins'
import { Game, GameView } from '~/models/Game'
import * as types from '~/store/mutation-types'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppInput: () => import('~/components/form/input.vue'),
    AppButton: () => import('~/components/button/button.vue'),
    AppLink: () => import('~/components/link.vue')
  }
})
export default class CreateGame extends Vue {
  playerInputVisible = true
  game: Form<Game> = new Form<Game>({
    name: '',
    private: false
  })

  constructor() {
    super()

    Object.assign(
      this,
      mapMutations({
        [types.ADD_GAME]: `games/${types.ADD_GAME}`
      })
    )
  }

  async createGame() {
    try {
      const { data: game } = await this.game.post<GameView>(`games`)
      this[types.ADD_GAME](game)

      await this.$store.dispatch('games/joinGame', game)

      this.$router.push(`/game/${game.name}/play`)
    } catch (e) {
      // TODO: Notify user
    }
  }
}
</script>
