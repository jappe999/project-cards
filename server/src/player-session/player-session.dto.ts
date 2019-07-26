import { IsNotEmpty, IsArray, IsString } from 'class-validator'
import { PlayerInCard } from '../player-card/player-card.entity'
import { User } from '../users/user.entity'
import { Session } from '../sessions/session.entity'

export class PlayerInSessionCreateDto {
  @IsString()
  public playerId?: string

  @IsString()
  public sessionId?: string

  @IsNotEmpty()
  public player!: User

  @IsNotEmpty()
  public session!: Session

  @IsArray()
  public playerCards?: PlayerInCard[]
}
