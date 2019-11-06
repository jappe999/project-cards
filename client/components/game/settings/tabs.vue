<template>
  <ul class="w-full flex justify-start -mt-2 px-4 bg-gray-200">
    <li>
      <button
        bg="white"
        color="gray-800"
        class="pt-4 pb-3 px-4 border-b-2 shadow-none border-gray-800"
        :class="{
          'bg-gray-300': state === 'choose-decks',
        }"
        @click="changeState('choose-decks')"
      >
        Card decks
      </button>
    </li>
  </ul>
</template>

<script>
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
  },
})
export default class AppGameSettingsTabs extends Vue {
  state = 'choose-decks'

  @Emit('change')
  changeState(name) {
    return (this.state = name)
  }
}
</script>
