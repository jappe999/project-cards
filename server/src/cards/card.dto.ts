import { IsNotEmpty, IsUUID } from 'class-validator';
import { CardType } from './card.entity';
import { DeckViewDto } from '../decks/deck.dto';

export class CardViewDto {
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  type!: CardType | string;

  @IsNotEmpty()
  text!: string;

  numAnswers!: number;

  deck?: DeckViewDto;
}
