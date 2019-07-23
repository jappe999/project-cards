import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
} from 'typeorm'
import { User } from '../users/user.entity'
import { Session } from '../sessions/session.entity'
import { PlayerInCard } from './player-card.entity'

@Entity()
export class PlayerInSession {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column()
  public playerId!: string

  @Column()
  public sessionId!: string

  @ManyToOne(() => User, player => player.playerInSession)
  public player!: User

  @ManyToOne(() => Session, session => session.playerInSession)
  public session!: Session

  @OneToMany(() => PlayerInCard, playerInCard => playerInCard.playerSession)
  @JoinTable()
  public playerCards!: PlayerInCard[]
}
