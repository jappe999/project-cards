import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Session } from '../sessions/session.entity'
import { PlayerInCard } from '../player-card/player-card.entity'

@Entity()
export class PlayerInSession {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  public playerId!: string

  @Column()
  public sessionId!: string

  /**
   * The player that is connected
   */
  @ManyToOne(() => User, player => player.playerInSession)
  public player!: User

  /**
   * The session the player is playing in.
   */
  @ManyToOne(
    () => Session,
    session => session.playerInSession,
    { cascade: true, onDelete: 'CASCADE', }
  )
  @JoinColumn()
  public session!: Session

  /**
   * The connection to the cards the player has played in the current session.
   */
  @OneToMany(() => PlayerInCard, playerInCard => playerInCard.playerSession)
  public playerCards!: PlayerInCard[]
}
