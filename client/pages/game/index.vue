<template>
  <div class="min-h-screen w-full flex-grow flex flex-col">
    <div
      class="flex flex-wrap justify-between items-center pt-12 pb-8 px-4 sm:px-8"
    >
      <header class="flex items-center mb-4 mr-0 lg:mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
        >
          <path
            d="M11 20v-2.08a6 6 0 0 1-4.24-3A4.02 4.02 0 0 1 2 11V6c0-1.1.9-2 2-2h2c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v5a4 4 0 0 1-4.76 3.93A6 6 0 0 1 13 17.92V20h4a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2h4zm6.92-7H18a2 2 0 0 0 2-2V6h-2v6c0 .34-.03.67-.08 1zM6.08 13A6.04 6.04 0 0 1 6 12V6H4v5a2 2 0 0 0 2.08 2zM8 4v8a4 4 0 1 0 8 0V4H8z"
          />
        </svg>
        <h3 class="text-2xl md:text-4xl ml-4">
          Choose a game
        </h3>
      </header>

      <app-button-link
        to="/game/create"
        class="flex justify-center items-center w-full lg:w-auto group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="fill-current"
        >
          <path
            d="M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z"
          />
        </svg>
        <span
          class="lg:max-w-0 group-hover:max-w-xs overflow-hidden whitespace-no-wrap transition-slow"
        >
          Or create a game
        </span>
      </app-button-link>
    </div>

    <div class="flex flex-wrap w-full py-8 px-2 sm:px-6">
      <div
        v-for="game in games"
        :key="game.id"
        class="w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 pb-4 px-2"
      >
        <nuxt-link :to="`game/${game.id}/play`">
          <app-card class="h-full flex">
            <app-card-content class="w-full">
              <h4>{{ game.name }}</h4>
              <small>By Jasper</small>
            </app-card-content>
            <div class="flex justify-end items-center border-l border-gray-200">
              <app-card-content class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path
                    d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8.41l2.54 2.53a1 1 0 0 1-1.42 1.42L11.3 12.7A1 1 0 0 1 11 12V8a1 1 0 0 1 2 0v3.59z"
                  />
                </svg>
                <span class="w-4 text-right">
                  {{ Math.round(Math.random() * 5) }}
                </span>
              </app-card-content>
              <app-card-content class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path
                    d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
                  />
                </svg>
                <span class="w-4 text-right">
                  {{ game.participants || Math.round(Math.random() * 10) }}
                </span>
              </app-card-content>
            </div>
          </app-card>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Context } from '@nuxt/vue-app'
import { GameView } from '../../models/Game'

@Component({
  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppButtonLink: () => import('~/components/button/button-link.vue'),
  },
  asyncData(context: Context) {
    return context.store.dispatch('games/fetchGames')
  },
})
export default class Home extends Vue {
  @Getter('games/games') games!: GameView[]
}
</script>
