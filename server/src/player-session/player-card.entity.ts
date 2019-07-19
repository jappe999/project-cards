import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { PlayerInSession } from './player-session.entity'
import { Card } from '../cards/card.entity'

@Entity()
export class PlayerInCard {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @ManyToOne(type => PlayerInSession)
  public playerSession: PlayerInSession

  @ManyToOne(type => Card)
  public card!: Card
}
