import { IsNotEmpty, IsNumber, IsBoolean, MaxLength, IsArray } from 'class-validator'
import { Game } from './game.entity'
import { Deck } from '../decks/deck.entity'

export class GameCreateDto extends Game {
  @IsNotEmpty()
  @MaxLength(128)
  name!: string

  @IsNumber()
  userLimit?: number

  @IsBoolean()
  private!: boolean

  @IsArray()
  decks!: Deck[]
}

export class GameJoinDto extends Game {
  @IsNotEmpty()
  id!: string

  @IsNotEmpty()
  @MaxLength(128)
  name!: string
}
