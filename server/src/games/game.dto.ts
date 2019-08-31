import { IsNotEmpty, IsNumber, IsBoolean, MaxLength } from 'class-validator'
import { Game } from './game.entity'

export class GameCreateDto extends Game {
  @IsNotEmpty()
  @MaxLength(128)
  name!: string

  @IsNumber()
  userLimit?: number

  @IsBoolean()
  private!: boolean
}

export class GameJoinDto extends Game {
  @IsNotEmpty()
  id!: string

  @IsNotEmpty()
  @MaxLength(128)
  name!: string
}
