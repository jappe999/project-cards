<template>
  <div>{{ game.name }}</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/vue-app'
import { Game } from '~/models/Game'

@Component({
  async asyncData(context: Context) {
    const { game: name } = context.route.params
    const game = await context.store.dispatch('games/fetchGame', name)

    return {
      game
    }
  }
})
export default class PlayGame extends Vue {
  game?: Game
}
</script>
