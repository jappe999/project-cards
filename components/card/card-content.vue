<template>
  <div class="p-4">
    <slot></slot>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppCardContent extends Vue {}
</script>
