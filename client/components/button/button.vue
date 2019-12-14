<template>
  <button
    :class="
      `flex items-center justify-center px-6 py-2 rounded ${colorsClass} shadow transition`
    "
    :disabled="disabled"
  >
    <app-loader :loading="loading" :color="color" class="mr-2" />
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppLoader: () => import('~/components/loader.vue'),
  },
})
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
