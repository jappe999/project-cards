import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
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

  @OneToMany(() => PlayerInSession, playerInSession => playerInSession.session)
  public playerInSession!: PlayerInSession[]
}
