import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm'
import { Game } from '../games/game.entity'
import { Card } from '../cards/card.entity'
import { User } from '../users/user.entity'

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  room!: string

  @OneToOne(() => Game)
  @JoinColumn()
  game!: Game

  @OneToOne(() => Card)
  @JoinColumn()
  currentCard!: Card

  @ManyToMany(() => User, user => user.sessions)
  @JoinColumn()
  players!: User[]
}
