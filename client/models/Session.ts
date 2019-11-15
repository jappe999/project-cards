import Model from './Model'
import { GameView } from './Game'
import { CardView } from './Card'
import { PlayerView } from './Player'
import { PlayerSessionView } from './PlayerSession'

export interface ISession {
  id?: string
  room: string
  currentRound?: number
  gameId: string
  currentCzarId?: string
  game: GameView
  currentCard: CardView
  currentCzar: PlayerView
  playerInSession: PlayerSessionView[]
}

export class SessionView extends Model implements ISession {
  id: string = ''
  room: string
  currentRound: number = 0
  gameId: string
  currentCzarId?: string
  game: GameView
  currentCard: CardView
  currentCzar: PlayerView
  playerInSession: PlayerSessionView[]
}

export class SessionJoin extends Model {
  game: GameView
}
