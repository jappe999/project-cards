import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 128 })
  @IsNotEmpty()
  name!: string;

  @Column('int')
  userLimit?: number;

  @Column()
  private!: boolean;
}
