import { IsNotEmpty, IsUUID } from 'class-validator';
import { CardType } from './card.entity';

export class CardViewDto {
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  type!: CardType | string;

  @IsNotEmpty()
  text!: string;

  numAnswers!: number;

  expansion!: string;
}
