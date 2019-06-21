import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class GameCreateDto {
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  userLimit?: number;

  @IsBoolean()
  private!: boolean;
}
