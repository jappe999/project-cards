<template>
  <div
    class="min-h-screen w-full md:flex justify-center items-center bg-gray-200"
  >
    <div
      v-if="!gameJoined"
      class="md:sticky top-0 flex flex-col items-center p-4 md:p-8 md:border-r border-gray-400 bg-gray-200 border-b md:border-b-0 text-center overflow-y-auto"
      :class="
        $auth.loggedIn
          ? 'h-screen md:w-96 justify-between'
          : 'w-full md:w-auto justify-center mb-4 md:mb-0 md:mr-12 md:pr-12'
      "
    >
      <div>
        <img
          src="~/static/icon.png"
          class="max-w-xs w-24 sm:w-48 md:w-full"
          alt="Logo"
        />
        <h1 class="text-5xl font-bold">Project Cards</h1>
      </div>

      <div class="w-full mt-8">
        <app-button v-if="$auth.loggedIn" class="w-full" @click.native="logout">
          Logout
        </app-button>
        <p class="-mb-4 pt-4 text-sm">
          Created with love by
          <a
            class="px-0 py-1 text-red-700 hover:text-black focus:text-black border-b border-transparent hover:border-black focus:border-black"
            href="https://jappe999.github.io"
          >
            Jasper
          </a>
        </p>
      </div>
    </div>

    <div
      class="w-full flex flex-col items-center"
      :class="{ 'max-w-sm mx-auto md:mx-0 p-4 md:p-0': !$auth.loggedIn }"
    >
      <transition name="page">
        <nuxt />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    AppButton: () => import('~/components/button/button.vue'),
  },
})
export default class DefaultLayout extends Vue {
  $auth

  get gameJoined() {
    return typeof this.$route.params.game !== 'undefined'
  }

  logout() {
    this.$auth.logout()
    this.$router.push('/game')
  }
}
</script>
