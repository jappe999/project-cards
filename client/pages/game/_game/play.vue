<template>
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
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import * as types from '~/store/mutation-types'
import { GameView } from '~/models/Game'
import { SessionView } from '~/models/Session'
import { CardView } from '~/models/Card'

@Component({
  components: {
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

  state: string = ''

  /** @var playedCards - Cards played in each round. */
  playedCards: CardView[][] = [[]]

  /** @var bestCards - The best cards from each round. */
  bestCards: CardView[][] = []

  /** @var selectedCards - The cards that the player has selected this round. */
  selectedCards: CardView[] = []

  /** @var selectedCardCombination - The cards that the player has selected this round. */
  selectedCardCombination: CardView[] = []

  /** @var game - The game that is currently being played. */
  @Getter('games/currentGame') game: GameView

  /** @var session - The session the user is currently in. */
  @Getter('session/session') session: SessionView

  /** @var round - The number of the current round. */
  @Getter('session/round') round: number

  /** @var $socket - The socket connection to the server. */
  get $socket(): SocketIOClient.Socket {
    const name = '$socket'
    return window[name]
  }

  /** Determine if the current user is the card czar */
  get isCzar(): boolean {
    return this.session.currentCzarId === this.$auth.user.id
  }

  @Mutation(`session/${types.UPDATE_SESSION}`) updateSession: (
    session: Partial<SessionView>,
  ) => void

  beforeMount() {
    this.$socket.on('session-join', this.onSessionJoin.bind(this))
    this.$socket.on('session-exit', this.onSessionExit.bind(this))
    this.$socket.on('session-next-round', this.onSessionNextRound.bind(this))
    this.$socket.on('session-play-card', this.onSessionPlayCard.bind(this))
    this.$socket.on(
      'session-choose-card-combination',
      this.onSessionChooseCardCombination.bind(this),
    )
  }

  mounted() {
    this.state = 'choose-cards'
  }

  onSessionJoin(session) {
    this.updateSession(session)
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
