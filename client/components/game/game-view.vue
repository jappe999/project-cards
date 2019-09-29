<template>
  <div class="min-h-full w-full flex flex-col sm:flex-row">
    <div
      class="min-w-64 sticky top-0 sm:border-r border-gray-400 bg-gray-200 shadow sm:shadow-none"
    >
      <div class="card-side-view sticky top-0 flex flex-col">
        <div class="flex flex-col items-center p-4 sm:p-8">
          <slot name="side"></slot>
        </div>

        <div
          class="h-48 hidden sm:block mt-auto sm:border-t border-gray-400 overflow-y-scroll"
        >
          <template v-if="session">
            <p
              class="sticky top-0 font-bold py-2 px-4 sm:px-8 bg-gray-200 shadow"
            >
              Players:
            </p>
            <ul>
              <li
                v-for="({ player }, index) in session.playerInSession"
                :key="player.id"
                class="flex justify-between py-2 px-4 sm:px-8"
                :class="{
                  'bg-gray-300': index % 2 === 0,
                  'bg-gray-200': index % 2 !== 0,
                }"
              >
                <span>{{ player.username }}</span>
                <div class="my-auto" title="Czar">
                  <svg
                    v-if="session.currentCzarId === player.id"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M17.56 17.66a8 8 0 0 1-11.32 0L1.3 12.7a1 1 0 0 1 0-1.42l4.95-4.95a8 8 0 0 1 11.32 0l4.95 4.95a1 1 0 0 1 0 1.42l-4.95 4.95zm-9.9-1.42a6 6 0 0 0 8.48 0L20.38 12l-4.24-4.24a6 6 0 0 0-8.48 0L3.4 12l4.25 4.24zM11.9 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                    />
                  </svg>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <p>No players</p>
          </template>
        </div>
      </div>
    </div>

    <div
      class="h-full flex flex-wrap flex-grow py-8 px-2 sm:px-6 overflow-y-auto"
    >
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class AppGameView extends Vue {
  @Prop({ default: () => ({}), type: Object }) session!: any
}
</script>

<style scoped>
@media screen and (min-width: 640px) {
  .card-side-view {
    min-height: calc(100vh - 56px);
  }
}
</style>
