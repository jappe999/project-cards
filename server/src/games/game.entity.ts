import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Session } from '../sessions/session.entity'
import { User } from '../users/user.entity'
import { Deck } from '../decks/deck.entity'

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

  @ManyToMany(() => Deck, deck => deck.games)
  @JoinTable()
  public decks!: Deck[]

  /**
   * Generate the unique name of the given game.
   */
  get roomName(): string {
    return `${this.id}-${this.name.replace(' ', '-')}`
  }
}
