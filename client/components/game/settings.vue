<template>
  <transition name="game-settings">
    <div
      v-if="show"
      class="wrapper h-full max-h-full w-full fixed flex justify-end p-4"
    >
      <app-card
        v-if="show"
        v-click-outside="close"
        class="w-full max-w-lg flex flex-col overflow-hidden"
      >
        <app-card-content class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">
            Game settings
          </h2>

          <button class="group cursor-pointer" @click="close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="h-5 fill-current text-gray-800 hover:text-gray-900"
            >
              <path
                class="group-hover:hidden"
                d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
              />
              <path
                class="hidden group-hover:block"
                d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.4 10l2.83-2.83-1.41-1.41L10 8.59 7.17 5.76 5.76 7.17 8.59 10l-2.83 2.83 1.41 1.41L10 11.41l2.83 2.83 1.41-1.41L11.41 10z"
              />
            </svg>
          </button>
        </app-card-content>

        <app-settings-tabs @change="changeState" />

        <app-card-content class="overflow-y-auto">
          <transition-group name="page">
            <app-settings-decks
              v-show="tab === 'choose-decks'"
              key="choose-decks"
              ref="decks"
              :selected-decks="gameDecks"
            />
          </transition-group>
        </app-card-content>

        <hr class="mt-auto border-b border-gray" />

        <app-card-content class="overflow-y-auto">
          <div class="flex justify-end">
            <app-button :loading="isSaving" @click.native="save">
              Save
            </app-button>
          </div>
        </app-card-content>
      </app-card>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { GameView } from '../../models/Game'
import { DeckView } from '../../models/Deck'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppSettingsTabs: () => import('~/components/game/settings/tabs.vue'),
    AppSettingsDecks: () => import('~/components/game/settings/decks.vue'),
  },
})
export default class AppGameSettings extends Vue {
  tab: string = 'choose-decks'

  isSaving: boolean = false

  @Prop({ default: false, type: Boolean }) show!: boolean

  @Getter('games/currentGame') game!: GameView
  @Getter('games/gameDecks') gameDecks!: DeckView[]

  @Action('games/updateGame') updateGame!: Function

  changeState(tab) {
    this.tab = tab
  }

  @Emit('close')
  close() {
    return false
  }

  async save() {
    this.isSaving = true

    // @ts-ignore
    const decks = this.$refs.decks.getSelectedDecks()
    await this.updateGame({
      ...this.game,
      decks,
    })
    this.close()

    this.isSaving = false
  }
}
</script>

<style lang="postcss">
.wrapper {
  background-color: rgba(26, 32, 44, 0.75);
}
</style>
