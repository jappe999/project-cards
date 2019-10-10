<template>
  <button
    :class="
      `flex items-center justify-center px-6 py-2 rounded ${colorsClass} shadow transition`
    "
    :disabled="disabled"
  >
    <span
      v-if="loading"
      :class="`loader h-3 w-3 mr-2 border-2 border-${color} rounded-full`"
      style="border-bottom-color:transparent"
    ></span>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppButton extends Vue {
  @Prop({ default: 'gray-800', type: String }) bg!: string
  @Prop({ default: 'gray-900', type: String }) bgHover!: string
  @Prop({ default: 'white', type: String }) color!: string
  @Prop({ default: 'white', type: String }) colorHover!: string
  @Prop({ default: false, type: Boolean }) loading!: boolean
  @Prop({ default: false, type: Boolean }) disabled!: boolean

  get colorsClass() {
    const actions = this.disabled
      ? 'text-white bg-gray-600 cursor-not-allowed'
      : `text-${this.color} bg-${this.bg} hover:text-${this.colorHover} focus:text-${this.colorHover} hover:bg-${this.bgHover} focus:bg-${this.bgHover}`
    return actions
  }
}
</script>

<style scoped>
.loader {
  animation: loading 1s linear infinite;
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
