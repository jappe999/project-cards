<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <img
      src="~/static/logo-animated.svg"
      class="max-w-xs w-32 mx-auto"
      alt="Logo"
    />
    <h1 class="my-4 text-2xl font-bold">Project Cards</h1>
    <small v-if="!offline">Loading game</small>
    <template v-if="offline">
      <p class="font-bold text-red-600">Server offline</p>
      <p>Please try again later</p>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class AppIndex extends Vue {
  offline: boolean = false

  created() {
    const url = ''
    const timeout = 30000

    // Try to load the page.
    this.waitForServer(url, timeout)
      .then(this.loaded)
      .catch(() => this.waitForServer(url, timeout))
      .then(this.loaded)
      .catch(() => {
        this.offline = true
      })
  }

  loaded() {
    setTimeout(() => {
      this.$emit('loaded')
    }, 500)
  }

  async waitForServer(url: string, timeout: number) {
    const uniqueUrl = `${url}?${Math.random() * 10}`
    const controller = new AbortController()
    const signal = controller.signal
    const response = await fetch(uniqueUrl, { mode: 'no-cors', signal })

    setTimeout(() => {
      controller.abort()
    }, timeout)

    return response
  }
}
</script>
