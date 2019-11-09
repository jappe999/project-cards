import Model from './Model'
import { PlayerView } from './Player'
import { SessionView } from './Session'
import { PlayerCardView } from './PlayerCard'

export interface IPlayerSession {
    id?: string;
    playerId: string
    sessionId: string
    player: PlayerView
    session: SessionView
    playerCards: PlayerCardView[]
}

export class PlayerSessionView extends Model implements IPlayerSession {
    id: string = ''
    playerId!: string
    sessionId!: string
    player!: PlayerView
    session!: SessionView
    playerCards!: PlayerCardView[]
}