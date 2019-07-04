import { IsNotEmpty, IsNumber, IsBoolean, MaxLength } from 'class-validator';

export class SessionJoinDto {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @MaxLength(128)
  name!: string;
}
