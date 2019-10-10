<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <img
      src="~/static/logo-animated.svg"
      class="max-w-xs w-32 mx-auto"
      alt="Logo"
    />
    <h1 class="my-4 text-2xl font-bold">Project Cards</h1>
    <small v-if="!offline">Loading game</small>
    <b v-if="offline" class="text-red">Server offline</b>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class AppIndex extends Vue {
  offline: boolean = false

  created() {
    this.waitForServer(`?${Math.random() * 10}`, 30000).then(() => {
      setTimeout(() => {
        this.$emit('loaded')
      }, 1000)
    })
  }

  waitForServer(url: string, timeout: number) {
    const controller = new AbortController()
    const signal = controller.signal
    return fetch(url, { mode: 'no-cors', signal })
      .then(response => {
        setTimeout(() => {
          controller.abort()
        }, timeout)
        return response
      })
      .catch(() => {
        this.offline = true
      })
  }
}
</script>
