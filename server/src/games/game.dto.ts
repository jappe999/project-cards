import { IsNotEmpty, IsNumber, IsBoolean, MaxLength } from 'class-validator';

export class GameCreateDto {
  @IsNotEmpty()
  @MaxLength(128)
  name!: string;

  @IsNumber()
  userLimit?: number;

  @IsBoolean()
  private!: boolean;
}

export class GameJoinDto {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @MaxLength(128)
  name!: string;
}
