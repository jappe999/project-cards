import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  Column,
  JoinTable,
  JoinColumn,
} from 'typeorm'
import { PlayerInSession } from '../player-session/player-session.entity'
import { Card } from '../cards/card.entity'

@Entity()
export class PlayerInCard {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  /**
   * The current round.
   */
  @Column({ type: Number })
  round: number

  /**
   * The connection to the player and session.
   */
  @ManyToOne(
    () => PlayerInSession,
    playerInSession => playerInSession.playerCards,
    { cascade: true, onDelete: 'CASCADE', }
  )
  @JoinColumn()
  public playerSession: PlayerInSession

  /**
   * The cards played by the player in the current round.
   */
  @ManyToMany(() => Card)
  @JoinTable()
  public cards!: Card[]
}
