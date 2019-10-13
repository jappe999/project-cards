<template>
  <div class="min-h-full w-full flex items-center justify-center">
    <app-card class="w-full max-w-lg overflow-hidden">
      <app-card-content class="pb-0">
        <h2 class="text-2xl font-bold">
          Game settings
        </h2>
        <hr class="w-full mt-2 mb-2 border-b border-gray" />
      </app-card-content>

      <nuxt-child />
    </app-card>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    AppCard: () => import('~/components/card/card'),
    AppCardContent: () => import('~/components/card/card-content'),
  },
})
export default class AppGameSettings extends Vue {}
</script>
