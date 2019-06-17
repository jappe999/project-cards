<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <div
      class="flex flex-col items-center mr-12 pr-12 border-r border-gray-500"
    >
      <img src="~/static/icon.png" class="max-w-xs" alt="Logo" />
      <h1 class="text-5xl font-bold">Project Cards</h1>
    </div>

    <div class="w-full max-w-xs flex flex-col items-center">
      <nuxt-child />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Index extends Vue {}
</script>
