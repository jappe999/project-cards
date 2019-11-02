<template>
  <app-game-settings :decks="decks" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { DeckView } from '../../../models/Deck'

@Component({
  components: {
    AppGameSettings: () => import('~/components/game/settings.vue'),
  },
})
export default class GameSettings extends Vue {
  @Getter('decks/decks') decks!: DeckView[]

  @Action('decks/fetchDecks') fetchDecks!: Function

  async beforeMount() {
    await this.fetchDecks()
  }
}
</script>
