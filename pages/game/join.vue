<template>
  <div class="w-full flex flex-col items-center">
    <app-card class="w-full">
      <app-card-content>
        <h2 class="text-2xl font-bold">
          Join a game
        </h2>
        <hr class="w-full mt-2 mb-4 border-b border-gray" />

        <form @submit.prevent="joinGame">
          <app-input name="roomName" label="Room name" required />

          <div class="flex justify-end">
            <app-button @click.native="joinGame">Join game</app-button>
          </div>
        </form>
      </app-card-content>
    </app-card>

    <app-link class="mt-4" to="/game/create">Or create a game</app-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { GameJoin } from '~/models/Game'
import { Form } from '~/plugins'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppInput: () => import('~/components/form/input.vue'),
    AppButton: () => import('~/components/button/button.vue'),
    AppLink: () => import('~/components/link.vue')
  }
})
export default class JoinGame extends Vue {
  game = new Form<GameJoin>({
    name: ''
  })

  async joinGame() {
    await this.$store.dispatch('games/joinGame')
    this.$router.push(`/games/${this.game.data().name}/play`)
  }
}
</script>
