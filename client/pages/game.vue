<template>
  <div class="min-h-screen w-full flex justify-center items-center">
    <div
      v-if="!gameJoined"
      class="flex flex-col items-center mr-12 pr-12 border-r border-gray-500"
    >
      <img src="~/static/icon.png" class="max-w-xs" alt="Logo" />
      <h1 class="text-5xl font-bold">Project Cards</h1>
    </div>

    <div
      class="w-full flex flex-col items-center"
      :class="{ 'max-w-xs': !gameJoined }"
    >
      <nuxt-child />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Index extends Vue {
  get gameJoined() {
    return typeof this.$route.params.game !== 'undefined'
  }
}
</script>
