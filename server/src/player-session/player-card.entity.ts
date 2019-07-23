import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  Column,
  JoinTable,
} from 'typeorm'
import { PlayerInSession } from './player-session.entity'
import { Card } from '../cards/card.entity'

@Entity()
export class PlayerInCard {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ type: Number })
  round: number

  @ManyToOne(
    () => PlayerInSession,
    playerInSession => playerInSession.playerCards,
  )
  public playerSession: PlayerInSession

  @ManyToMany(type => Card)
  @JoinTable()
  public cards!: Card[]
}
