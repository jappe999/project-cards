<template>
  <button @click="share()">
    <slot>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        :class="`h-${size} text-${color} fill-current`"
      >
        <path
          d="M5.08 12.16A2.99 2.99 0 0 1 0 10a3 3 0 0 1 5.08-2.16l8.94-4.47a3 3 0 1 1 .9 1.79L5.98 9.63a3.03 3.03 0 0 1 0 .74l8.94 4.47A2.99 2.99 0 0 1 20 17a3 3 0 1 1-5.98-.37l-8.94-4.47z"
        />
      </svg>
    </slot>
  </button>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator'

export default class AppShare extends Vue {
  @Prop({ type: String }) subject?: string
  @Prop({ type: String }) text?: string
  @Prop({ type: String }) url?: string

  @Prop({ type: Number }) size: number = 4
  @Prop({ type: String }) color: string = 'white'

  get hasAPI() {
    return 'share' in window.navigator
  }

  share() {
    if (this.hasAPI) {
      // @ts-ignore
      window.navigator.share({
        title: this.subject,
        text: this.text,
        url: this.url,
      })
    }
  }
}
</script>
