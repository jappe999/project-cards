import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  JoinTable,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Game } from '../games/game.entity'
import { Card } from '../cards/card.entity'
import { PlayerInSession } from '../player-session/player-session.entity'

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  room!: string

  @Column()
  gameId: string

  @OneToOne(() => Game)
  @JoinColumn()
  game!: Game

  @OneToOne(() => Card)
  @JoinColumn()
  currentCard!: Card

  @Column({ nullable: true })
  currentCzarId?: string

  @OneToOne(() => User)
  @JoinColumn()
  currentCzar?: User

  @OneToMany(() => PlayerInSession, playerInSession => playerInSession.session)
  @JoinTable()
  public playerInSession!: PlayerInSession[]
}
