<template>
  <div class="flex flex-col rounded shadow" :class="cardClass">
    <app-card-content class="h-full">
      <slot></slot>
    </app-card-content>

    <app-card-content v-if="step" class="flex">
      <span class="h-6 w-6 text-center rounded-full text-white">
        {{ step }}
      </span>
    </app-card-content>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
  },
})
export default class AppPlayCard extends Vue {
  @Prop({ default: 'white', type: String }) color!: 'black' | 'white'
  @Prop({ default: null, type: [String, Number] }) step!: number

  get cardClass() {
    return {
      'bg-black text-white': this.color === 'black',
      'bg-white text-black': this.color === 'white',
    }
  }

  get cardContentClass() {
    return {
      'bg-white text-black': this.color === 'black',
      'bg-black text-white': this.color === 'white',
    }
  }
}
</script>

<style lang="postcss">
@screen sm {
  .sm\:h-96 {
    height: 22rem;
  }
}
</style>
