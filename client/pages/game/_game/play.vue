<template>
  <div>
    <h1>{{ game.name }}</h1>
    <p v-for="message in messages" :key="message">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/vue-app'
import { Game } from '~/models/Game'
import socket from '~/plugins/socket.io'

@Component({
  async asyncData(context: Context) {
    const c = console
    c.log(context.route.params)

    const { game: name } = context.route.params
    const game = await context.store.dispatch('games/fetchGame', name)
    context.store.dispatch('sessions/join')

    return { game }
  },
})
export default class PlayGame extends Vue {
  game?: Game
  session: any
  messages: any[] = []

  beforeMount() {
    socket.on('session-join', event => {
      this.session = event
    })

    socket.on('session-update', event => {
      this.messages.push(event)
    })
  }
}
</script>
