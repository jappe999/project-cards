<template>
  <div class="bg-white rounded shadow">
    <slot></slot>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppCard extends Vue {}
</script>
