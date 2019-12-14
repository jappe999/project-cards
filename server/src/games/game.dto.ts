import { IsNotEmpty, IsNumber, IsOptional, IsBoolean, MaxLength, IsArray, ArrayMinSize } from 'class-validator'
import { Game } from './game.entity'
import { Deck } from '../decks/deck.entity'

export class GameCreateDto extends Game {
  @IsNotEmpty()
  @MaxLength(128)
  name!: string

  @IsNumber()
  @IsOptional()
  userLimit?: number

  @IsBoolean()
  private!: boolean

  @IsArray()
  @ArrayMinSize(1)
  decks!: Deck[]
}

export class GameJoinDto extends Game {
  @IsNotEmpty()
  id!: string

  @IsNotEmpty()
  @MaxLength(128)
  name!: string
}
