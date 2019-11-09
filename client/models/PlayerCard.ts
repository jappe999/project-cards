import Model from './Model'
import { CardView } from './Card'
import { PlayerSessionView } from './PlayerSession'

export interface IPlayerCard {
    id: string
    round: number
    playerSession: PlayerSessionView
    cards: CardView[]
}

export class PlayerCardView extends Model implements IPlayerCard {
    id: string
    round: number = 0
    playerSession: PlayerSessionView
    cards: CardView[] = []
}