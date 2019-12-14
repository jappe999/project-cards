<template>
  <div
    v-if="loading"
    :class="
      `loader h-${size} w-${size} border-${thickness} border-${color} rounded-full`
    "
  ></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AppLoader extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean
  @Prop({ type: [String, Number], default: '3' }) size!: string | number
  @Prop({ type: [String, Number], default: '2' }) thickness!: string | number
  @Prop({ type: String, default: 'white' }) color!: string
}
</script>

<style scoped>
.loader {
  border-bottom-color: transparent;
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
