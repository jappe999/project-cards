import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Game } from '../games/game.entity';
import { Card } from '../cards/card.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  room!: string;

  @OneToOne(type => Game)
  @JoinColumn()
  game!: Game;

  @OneToOne(type => Card)
  @JoinColumn()
  currentCard!: Card;
}
