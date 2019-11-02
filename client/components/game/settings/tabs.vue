<template>
  <ul class="w-full flex justify-start">
    <li>
      <app-button class="w-full p-4 hover:bg-gray-100 text-left">
        Card decks
      </app-button>
    </li>
  </ul>
</template>

<script>
import { Vue, Prop } from 'vue-property-decorator'

@Prop({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
  },
})
export default class AppGameSettingsTabs extends Vue {}
</script>
