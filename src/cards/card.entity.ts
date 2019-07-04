import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type CardType = 'A' | 'Q';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 1 })
  type!: CardType | string;

  @Column()
  text!: string;

  @Column()
  numAnswers!: number;

  @Column()
  expansion!: string;
}
