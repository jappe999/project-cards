import Model from './Model'
import { GameView } from './Game'
import { CardView } from './Card'
import { PlayerView } from './Player'

export interface ISession {
  id?: string
  room: string
  currentRound?: number
  gameId: string
  currentCzarId?: string
  game: GameView
  currentCard: CardView
  currentCzar: PlayerView
  playerInSession: []
}

export class Session extends Model implements ISession {
  id: string = ''
  room: string
  currentRound: number = 0
  gameId: string
  currentCzarId?: string
  game: GameView
  currentCard: CardView
  currentCzar: PlayerView
  playerInSession: [] // Further refacotr
}

export class SessionView extends Session {}

export class SessionJoin extends Model {
  game: GameView
}
