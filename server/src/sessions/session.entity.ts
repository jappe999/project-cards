import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from '../games/game.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  room!: string;

  @ManyToOne(type => Game)
  @JoinColumn()
  game!: Game;
}
