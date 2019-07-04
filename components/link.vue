<template>
  <nuxt-link
    :class="
      `px-0 py-1 text-${color} hover:text-${colorHover} focus:text-${colorHover} border-b border-transparent hover:border-black focus:border-black`
    "
    :to="to"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class AppLink extends Vue {
  @Prop(String) to!: string
  @Prop({ default: 'gray-900', type: String }) color!: string
  @Prop({ default: 'black', type: String }) colorHover!: string
}
</script>
