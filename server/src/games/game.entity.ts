import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Session } from '../sessions/session.entity'
import { User } from '../users/user.entity'

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 128 })
  name!: string

  @Column({ type: 'int', nullable: true })
  userLimit?: number

  @Column()
  private!: boolean

  @OneToOne(() => Session, session => session.game)
  session!: Session

  @ManyToOne(() => User)
  @JoinColumn()
  creator!: User

  /**
   * Generate the unique name of the given game.
   */
  get roomName(): string {
    return `${this.id}-${this.name.replace(' ', '-')}`
  }
}
