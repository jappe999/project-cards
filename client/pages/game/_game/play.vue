<template>
  <div class="h-screen w-full overflow-hidden flex flex-col items-center">
    <div class="w-full flex sm:px-4 text-white bg-gray-900 shadow">
      <div class="md:w-80 flex -ml-4 pl-4">
        <nuxt-link
          class="flex items-center p-4"
          to="/game"
          @click.native="exitSession(game)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="h-5 fill-current"
          >
            <path
              d="M3.828 9l6.071-6.071-1.414-1.414L0 10l.707.707 7.778 7.778 1.414-1.414L3.828 11H20V9H3.828z"
            />
          </svg>
          <span class="hidden sm:block pl-2">Back to all games</span>
        </nuxt-link>
      </div>

      <h1 class="mx-auto md:mx-0 py-4 px-2">
        Game:
        <span class="font-bold">
          {{ game.name }}
        </span>
      </h1>

      <div class="md:ml-auto flex items-center justify-end">
        <app-share
          button-class="p-5"
          subject="Let's play a game of cards!"
          text="Join me in this game for horrible people."
          :url="shareURL"
        />
      </div>
    </div>

    <main class="h-full w-full relative overflow-x-hidden overflow-y-auto">
      <transition-group name="game-state">
        <app-choose-cards
          v-show="state === 'choose-cards'"
          key="choose-cards"
          :is-czar="isCzar"
          :selected-cards="selectedCards"
          :black-card="blackCard"
          :session="session"
          :round="round"
          @select="selectCards"
          @submit="playCards"
        />

        <app-choose-card-combination
          v-show="state === 'choose-card-combination'"
          key="choose-card-combination"
          :is-czar="isCzar"
          :selected-cards="selectedCardCombination"
          :cards="playedCards[round]"
          :black-card="blackCard"
          :session="session"
          :round="round"
          @select="selectCardCombination"
        />

        <app-show-best-combination
          v-show="state === 'show-best-combination'"
          key="show-best-combination"
          :is-czar="isCzar"
          :cards="bestCards[round]"
          :black-card="blackCard"
          :session="session"
          :round="round"
        />
      </transition-group>
    </main>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/vue-app'
import { Vue, Component } from 'vue-property-decorator'
import { GameView } from '~/models/Game'
import { CardView } from '~/models/Card'

@Component({
  async asyncData(context: Context) {
    const { game: name } = context.route.params
    const gameId = name
      .split('-')
      .slice(0, 5)
      .join('-')
    const game = await context.store.dispatch('games/fetchGame', gameId)

    return { game }
  },

  components: {
    AppShare: () => import('~/components/share.vue'),
    AppPlaycard: () => import('~/components/game/playcard.vue'),
    AppChooseCards: () => import('~/components/game/choose-cards.vue'),
    AppChooseCardCombination: () =>
      import('~/components/game/choose-card-combination.vue'),
    AppShowBestCombination: () =>
      import('~/components/game/show-best-combination.vue'),
  },
})
export default class PlayGame extends Vue {
  $auth!: any

  /** @var game - The game that is currently being played. */
  game!: GameView

  /** @var session - The session the user is currently in. */
  session: any = {}

  state: string = ''

  /** @var blackCards - The black cards that have been or are being used for a round. */
  blackCards: CardView[] = []

  /** @var playedCards - Cards played in each round. */
  playedCards: CardView[][] = [[]]

  /** @var bestCards - The best cards from each round. */
  bestCards: CardView[][] = []

  /** @var selectedCards - The cards that the player has selected this round. */
  selectedCards: CardView[] = []

  /** @var selectedCardCombination - The cards that the player has selected this round. */
  selectedCardCombination: CardView[] = []

  /** @var $socket - The socket connection to the server. */
  get $socket(): SocketIOClient.Socket {
    const name = '$socket'
    return window[name]
  }

  /** The black card for the current round. */
  get blackCard(): CardView {
    return this.session.currentCard || <CardView>{}
  }

  /** Determine if the current user is the card czar */
  get isCzar(): boolean {
    return this.session.currentCzarId === this.$auth.user.id
  }

  /** @var round - The number of the current round. */
  get round(): number {
    return this.session.currentRound || 0
  }

  get shareURL() {
    const { origin, pathname } = window.location
    return origin + pathname
  }

  beforeMount() {
    this.$socket.on('session-join', this.onSessionJoin.bind(this))
    this.$socket.on('session-exit', this.onSessionExit.bind(this))
    this.$socket.on('session-next-round', this.onSessionNextRound.bind(this))
    this.$socket.on('session-play-card', this.onSessionPlayCard.bind(this))
    this.$socket.on(
      'session-choose-card-combination',
      this.onSessionChooseCardCombination.bind(this),
    )

    this.joinSession(this.game)

    window.onbeforeunload = () => {
      this.exitSession(this.game)
    }
  }

  mounted() {
    this.state = 'choose-cards'
  }

  destroy() {
    window.onbeforeunload = null
    this.exitSession(this.game)
  }

  /**
   * Emit a message to join a game session.
   */
  joinSession(game: GameView) {
    this.$socket.emit('session-join', { game })
  }

  /**
   * Emit a message to exit a game session.
   */
  exitSession(game: GameView) {
    this.$socket.emit('session-exit', { game })
  }

  onSessionJoin(session) {
    this.session = { ...this.session, ...session }
    this.blackCards = [...this.blackCards, session.currentCard]
    this.updatePlayedCards(session)
  }

  /**
   * Invoked when a player has left the game.
   * This updates the list of chosen cards.
   * @param payload - The payload sent by the server.
   * @param payload.session - The session of the current game.
   * @param payload.user - The user that has left the game.
   */
  onSessionExit({ session, user }) {
    session.playerInSession = session.playerInSession.filter(
      ({ playerId }) => playerId !== user.id,
    )

    this.session = { ...this.session, ...session }
    this.updatePlayedCards(session)
  }

  onSessionNextRound(session) {
    this.onSessionJoin(session)
    this.state = 'choose-cards'
  }

  onSessionPlayCard(playerSession) {
    const latestIndex = playerSession.playerCards.length - 1
    const cards = playerSession.playerCards[latestIndex].cards
    const playedCards = this.playedCards[this.round] || []

    this.playedCards[this.round] = [...playedCards, cards]
    this.playedCards = [...this.playedCards]

    const allPlayersPlayedCards =
      this.playedCards[this.round].length >=
      this.session.playerInSession.length - 1

    if (allPlayersPlayedCards) {
      this.state = 'choose-card-combination'
    }
  }

  onSessionChooseCardCombination({ cards }) {
    this.bestCards[this.round] = cards
    this.selectedCardCombination = []
    this.state = 'show-best-combination'
  }

  updatePlayedCards({ playerInSession }) {
    const cardsByActivePlayers = playerInSession
      // Get the cards played by the user.
      .map(({ playerCards }) => {
        const round = playerCards.find(({ round }) => round === this.round)
        return (round || {}).cards
      })
      // Filter items that are falsy.
      .filter(card => !!card)

    this.playedCards[this.round] = cardsByActivePlayers
    this.playedCards = [...this.playedCards]
  }

  selectCards(cards: CardView[]) {
    this.selectedCards = cards
  }

  selectCardCombination(cards: CardView[]) {
    this.selectedCardCombination = cards
  }

  playCards() {
    this.state = 'choose-card-combination'
  }
}
</script>
