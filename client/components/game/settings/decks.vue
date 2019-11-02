<template>
  <ul>
    <li v-for="deck in decks" :key="deck.id">
      <label>
        <input type="checkbox" />
        <span>{{ deck.name }}</span>
      </label>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DeckView } from '~/models/Deck'

@Component
export default class AppGameSettingsDecks extends Vue {
  @Prop({ default: () => [], type: Array }) decks!: DeckView[]
}
</script>
