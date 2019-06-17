<template>
  <button
    :class="
      `px-6 py-2 rounded text-${color} hover:text-${colorHover} focus:text-${colorHover} bg-${bg} hover:bg-${bgHover} focus:bg-${bgHover} shadow transition`
    "
  >
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
}
</script>
