<template>
  <app-game-settings />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    AppGameSettings: () => import('~/components/game/settings.vue'),
  },
})
export default class GameSettings extends Vue {}
</script>
