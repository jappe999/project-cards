import { IsNotEmpty, IsArray, IsString } from 'class-validator';
import { CardViewDto } from '../cards/card.dto';

export class DeckViewDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  name!: string

  @IsArray()
  cards!: CardViewDto[]
}
