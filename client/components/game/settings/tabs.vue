<template>
  <ul class="w-full flex justify-start -mt-2 px-4 bg-gray-200">
    <li>
      <button
        bg="white"
        color="gray-800"
        class="pt-4 pb-3 px-4 shadow-none"
        :class="{
          'bg-gray-400 border-b-2 border-gray-800':
            activeTab === 'choose-decks',
        }"
        @click="changeTab('choose-decks')"
      >
        Card decks
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
  },
})
export default class AppGameSettingsTabs extends Vue {
  /** @var activeTab - The name of the activate tab. */
  activeTab = 'choose-decks'

  /**
   * Set the current active tab.
   *
   * @param tab - The name of the tab to activate.
   * @returns The name of the active tab.
   */
  @Emit('change')
  changeTab(tab: string): string {
    return (this.activeTab = tab)
  }
}
</script>
