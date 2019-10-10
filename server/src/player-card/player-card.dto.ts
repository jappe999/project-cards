import { PlayerInSession } from '../player-session/player-session.entity'
import { CardViewDto } from '../cards/card.dto'
import { IsNotEmpty, IsNumber, IsArray } from 'class-validator'

export class PlayerInCardCreateDto {
  @IsNumber()
  round!: number

  @IsNotEmpty()
  playerSession!: PlayerInSession

  @IsArray()
  @IsNotEmpty()
  cards!: CardViewDto[]
}
