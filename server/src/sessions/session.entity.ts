import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm'
import { Game } from '../games/game.entity'
import { Card } from '../cards/card.entity'
import { PlayerInSession } from '../player-session/player-session.entity'

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

  @OneToMany(() => PlayerInSession, playerInSession => playerInSession.session)
  public playerInSession!: PlayerInSession[]
}
