<template>
  <div>
    <app-input v-model="game.name" name="name" label="Room name" required />

    <!-- The following option is not available yet -->
    <label v-if="false" class="flex items-center text-black">
      <input v-model="game.private" type="checkbox" class="mr-2" />
      <small>Private game?</small>
    </label>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import * as types from '~/store/mutation-types'

@Component({
  components: {
    AppInput: () => import('~/components/form/input.vue'),
  },
})
export default class AppGameSettingsDecks extends Vue {
  get game() {
    return { ...this.$store.getters['games/currentGame'] }
  }
  set game(game) {
    // this.$store.commit(`types/${types.UPDATE_GAME}`, game)
  }
}
</script>
