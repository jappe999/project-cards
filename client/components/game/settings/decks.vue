<template>
  <div>
    <div class="flex mb-4">
      <app-labelled-checkbox v-model="checkAll">
        Use all decks
      </app-labelled-checkbox>
    </div>

    <ul class="flex flex-wrap -mx-1">
      <li v-for="deck in decks" :key="deck.id" class="mb-2 mx-1">
        <app-labelled-checkbox v-model="deck.checked">
          {{ deck.name }}
        </app-labelled-checkbox>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { DeckView } from '~/models/Deck'

@Component({
  components: {
    AppLabelledCheckbox: () =>
      import('~/components/form/labelled-checkbox.vue'),
  },
  watch: {
    checkAll(checked) {
      this.decks = this.decks.map(deck => ({ ...deck, checked }))
    },
  },
})
export default class AppGameSettingsDecks extends Vue {
  checkAll: boolean = false

  decks: DeckView[] = []

  @Prop({ default: () => [], type: Array }) selectedDecks!: DeckView[]

  @Getter('decks/decks') fetchedDecks!: Function

  @Action('decks/fetchDecks') fetchDecks!: Function

  async beforeMount() {
    const decks =
      this.fetchedDecks.length === 0
        ? await this.fetchDecks({ take: 49 })
        : this.fetchedDecks

    this.decks = decks
      .map(deck => ({
        ...deck,
        checked: this.selectedDecks.some(sd => sd.id === deck.id),
      }))
      .sort((a, b) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
  }

  getSelectedDecks() {
    return this.decks.filter((deck: any) => deck.checked)
  }
}
</script>
