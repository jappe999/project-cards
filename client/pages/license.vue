<template>
  <div class="max-w-sm flex flex-col items-center">
    <app-card class="w-full mb-1">
      <app-card-content>
        <h2 class="text-2xl font-bold">License</h2>

        <hr class="w-full mt-2 mb-2 border-b border-gray" />

        <p class="mb-2">
          Project Cards is an online game based on, but not affiliated to,
          <a
            href="https://cardsagainshumanity.com/"
            target="_blank"
            class="px-0 pb-px text-red-700 hover:text-black focus:text-black border-b border-transparent hover:border-black focus:border-black"
          >
            Cards Against Humanity</a
          >.
        </p>

        <p class="mb-2">
          The source of this game is licensed under the
          <a
            href="https://github.com/jappe999/project-cards/blob/develop/LICENSE"
            target="_blank"
            class="px-0 pb-px text-red-700 hover:text-black focus:text-black border-b border-transparent hover:border-black focus:border-black"
            >GNU GENERAL PUBLIC LICENSE</a
          >. Bug reports and contributions are welcome on
          <a
            href="https://github.com/jappe999/project-cards/"
            target="_blank"
            class="px-0 pb-px text-red-700 hover:text-black focus:text-black border-b border-transparent hover:border-black focus:border-black"
            >GitHub</a
          >.
        </p>

        <p class="mb-2">
          The game concept and official card decks, created by Cards Against
          Humanity, are used under a
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/2.0/"
            target="_blank"
            class="px-0 pb-px text-red-700 hover:text-black focus:text-black border-b border-transparent hover:border-black focus:border-black"
            >Creative Commons BY-NC-SA 2.0</a
          >
          license.
        </p>

        <div class="flex justify-end mt-4">
          <app-button-link to="/game" bg="white" color="gray-800">
            Take me to the game
          </app-button-link>
        </div>
      </app-card-content>
    </app-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  // @ts-ignore
  auth: false,

  components: {
    AppCard: () => import('~/components/card/card.vue'),
    AppCardContent: () => import('~/components/card/card-content.vue'),
    AppButtonLink: () => import('~/components/button/button-link.vue'),
  },
})
export default class License extends Vue {
  //
}
</script>
