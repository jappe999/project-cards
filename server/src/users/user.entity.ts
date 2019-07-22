import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
} from 'typeorm'
import { PlayerInSession } from '../player-session/player-session.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  username!: string

  @Column()
  password!: string

  @Column({ nullable: true })
  loginTime?: Date

  @OneToMany(() => PlayerInSession, playerInSession => playerInSession.player)
  @JoinTable()
  public playerInSession!: PlayerInSession[]
}
