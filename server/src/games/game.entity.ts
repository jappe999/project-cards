import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 128 })
  @IsNotEmpty()
  name!: string;

  @Column()
  @IsNumber()
  userLimit?: number;

  @Column()
  @IsBoolean()
  private!: boolean;
}
