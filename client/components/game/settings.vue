<template>
  <div class="min-h-full w-full flex items-center justify-center">
    <app-card class="w-full max-w-lg overflow-hidden">
      <app-card-content>
        <h2 class="text-2xl font-bold">
          Game settings
        </h2>
        <hr class="w-full mt-2 mb-2 border-b border-gray" />
        <app-settings-tabs />
        <transition-group name="settings-tab">
          <app-settings-decks
            v-show="state === 'choose-decks'"
            key="choose-decks"
            :decks="decks"
          />
        </transition-group>
      </app-card-content>
    </app-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DeckView } from '../../models/Deck'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppSettingsTabs: () => import('~/components/game/settings/tabs.vue'),
    AppSettingsDecks: () => import('~/components/game/settings/decks.vue'),
  },
})
export default class AppGameSettings extends Vue {
  state: string = 'choose-decks'

  @Prop({ default: () => [], type: Array }) decks!: DeckView[]
}
</script>
